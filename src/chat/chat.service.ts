import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DateTime } from 'luxon';
import { ChatRoom, ChatMessage, Staff } from '../entities';

export interface CreateChatRoomDto {
  name: string;
  description?: string;
  memberIds: number[];
  createdBy: number;
}

export interface SendMessageDto {
  chatRoomId: number;
  content: string;
  senderId: number;
  messageType?: string;
}

@Injectable()
export class ChatService {
  private cache = new Map<string, { data: any; expiry: number }>();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  constructor(
    @InjectRepository(ChatRoom)
    private chatRoomRepository: Repository<ChatRoom>,
    @InjectRepository(ChatMessage)
    private chatMessageRepository: Repository<ChatMessage>,
    @InjectRepository(Staff)
    private staffRepository: Repository<Staff>,
  ) {}

  async createChatRoom(createRoomDto: CreateChatRoomDto): Promise<ChatRoom> {
    const { name, description, memberIds, createdBy } = createRoomDto;
    
    console.log('🔍 [ChatService] Creating chat room:', { name, description, memberIds, createdBy });
    
    // Find all staff members including the creator
    const allMemberIds = [...new Set([...memberIds, createdBy])];
    console.log('👥 [ChatService] Finding members with IDs:', allMemberIds);
    
    const members = await this.staffRepository
      .createQueryBuilder('staff')
      .where('staff.id IN (:...ids)', { ids: allMemberIds })
      .getMany();
    
    console.log('✅ [ChatService] Found members:', members.length, members.map(m => ({ id: m.id, name: m.name })));
    
    const chatRoom = this.chatRoomRepository.create({
      name,
      description,
      members,
      createdBy,
      isGroup: memberIds.length > 1
    });

    console.log('💬 [ChatService] Saving chat room...');
    const savedRoom = await this.chatRoomRepository.save(chatRoom);
    console.log('✅ [ChatService] Chat room saved with ID:', savedRoom.id);
    
    return savedRoom;
  }

  async getChatRoomsByUser(userId: number): Promise<ChatRoom[]> {
    console.log('🔍 [ChatService] Getting chat rooms for user:', userId);
    
    try {
      // Check cache first
      const cacheKey = `chat_rooms_user_${userId}`;
      const cachedRooms = this.getFromCache<ChatRoom[]>(cacheKey);
      if (cachedRooms) {
        console.log('💬 [ChatService] Returning cached chat rooms:', cachedRooms.length);
        return cachedRooms;
      }
      
      // Get all rooms where the user is a member, then load all members for each room
      const rooms = await this.chatRoomRepository
        .createQueryBuilder('room')
        .leftJoin('room.members', 'members')
        .where('members.id = :userId', { userId })
        .orderBy('room.createdAt', 'DESC')
        .getMany();
      
      // Now load all members for each room
      for (const room of rooms) {
        const roomWithMembers = await this.chatRoomRepository
          .createQueryBuilder('room')
          .leftJoinAndSelect('room.members', 'allMembers')
          .where('room.id = :roomId', { roomId: room.id })
          .getOne();
        
        if (roomWithMembers) {
          room.members = roomWithMembers.members;
        }
      }
      
      // Cache for 5 minutes
      this.setCache(cacheKey, rooms, 300000);
      
      console.log('💬 [ChatService] Chat rooms found:', rooms.length, rooms.map(r => ({ 
        id: r.id, 
        name: r.name, 
        memberCount: r.members?.length || 0,
        members: r.members?.map(m => ({ id: m.id, name: m.name })) || []
      })));
      return rooms;
    } catch (error) {
      console.error('❌ [ChatService] Error getting chat rooms:', error);
      throw error;
    }
  }

  async getChatRoomById(roomId: number, userId: number): Promise<ChatRoom | null> {
    // First check if user is a member of the room
    const userIsMember = await this.chatRoomRepository
      .createQueryBuilder('room')
      .leftJoin('room.members', 'members')
      .where('room.id = :roomId', { roomId })
      .andWhere('members.id = :userId', { userId })
      .getCount() > 0;
    
    if (!userIsMember) {
      return null;
    }
    
    // Now get the room with all members
    return this.chatRoomRepository
      .createQueryBuilder('room')
      .leftJoinAndSelect('room.members', 'members')
      .leftJoinAndSelect('room.messages', 'messages')
      .leftJoinAndSelect('messages.sender', 'sender')
      .where('room.id = :roomId', { roomId })
      .getOne();
  }

  async sendMessage(sendMessageDto: SendMessageDto): Promise<ChatMessage> {
    const { chatRoomId, content, senderId, messageType = 'text' } = sendMessageDto;
    
    // Verify user is member of the chat room
    const chatRoom = await this.getChatRoomById(chatRoomId, senderId);
    if (!chatRoom) {
      throw new Error('User is not a member of this chat room');
    }

    const message = this.chatMessageRepository.create({
      content,
      messageType,
      chatRoomId,
      senderId,
      createdAt: DateTime.now().setZone('Africa/Nairobi').toJSDate()
    });

    const savedMessage = await this.chatMessageRepository.save(message);
    
    // Invalidate relevant caches
    this.invalidateCache(`messages_room_${chatRoomId}`);
    this.invalidateCache(`chat_rooms_user_${senderId}`);
    
    return savedMessage;
  }

  async getMessagesByRoom(roomId: number, userId: number, limit: number = 50, offset: number = 0): Promise<ChatMessage[]> {
    // Verify user is member of the chat room
    const chatRoom = await this.getChatRoomById(roomId, userId);
    if (!chatRoom) {
      throw new Error('User is not a member of this chat room');
    }

    // Check cache for recent messages
    const cacheKey = `messages_room_${roomId}_${offset}_${limit}`;
    const cachedMessages = this.getFromCache<ChatMessage[]>(cacheKey);
    if (cachedMessages) {
      console.log('💬 [ChatService] Returning cached messages:', cachedMessages.length);
      return cachedMessages;
    }

    const messages = await this.chatMessageRepository
      .createQueryBuilder('message')
      .leftJoinAndSelect('message.sender', 'sender')
      .where('message.chatRoomId = :roomId', { roomId })
      .orderBy('message.createdAt', 'DESC')
      .limit(limit)
      .offset(offset)
      .getMany();

    // Cache for 2 minutes
    this.setCache(cacheKey, messages, 120000);
    
    return messages;
  }

  async getNewMessages(roomId: number, userId: number, lastMessageId: number): Promise<ChatMessage[]> {
    // Verify user is member of the chat room
    const chatRoom = await this.getChatRoomById(roomId, userId);
    if (!chatRoom) {
      throw new Error('User is not a member of this chat room');
    }

    return this.chatMessageRepository
      .createQueryBuilder('message')
      .leftJoinAndSelect('message.sender', 'sender')
      .where('message.chatRoomId = :roomId', { roomId })
      .andWhere('message.id > :lastMessageId', { lastMessageId })
      .orderBy('message.createdAt', 'ASC')
      .getMany();
  }

  async getAllStaff(): Promise<Staff[]> {
    console.log('🔍 [ChatService] Getting all staff members...');
    
    // Check cache first
    const cacheKey = 'all_staff_members';
    const cachedStaff = this.getFromCache<Staff[]>(cacheKey);
    if (cachedStaff) {
      console.log('👥 [ChatService] Returning cached staff members:', cachedStaff.length);
      return cachedStaff;
    }
    
    const staff = await this.staffRepository
      .createQueryBuilder('staff')
      .select(['staff.id', 'staff.name', 'staff.business_email', 'staff.role', 'staff.avatar_url'])
      .where('staff.is_active = :isActive', { isActive: 1 })
      .orderBy('staff.name', 'ASC')
      .getMany();
    
    // Cache for 10 minutes
    this.setCache(cacheKey, staff, 600000);
    
    console.log('👥 [ChatService] Staff members found:', staff.length, staff);
    return staff;
  }

  async markMessageAsRead(messageId: number, userId: number): Promise<void> {
    await this.chatMessageRepository.update(
      { id: messageId },
      { isRead: true, readAt: DateTime.now().setZone('Africa/Nairobi').toJSDate() }
    );
  }

  async getUnreadMessageCount(roomId: number, userId: number): Promise<number> {
    return this.chatMessageRepository
      .createQueryBuilder('message')
      .where('message.chatRoomId = :roomId', { roomId })
      .andWhere('message.senderId != :userId', { userId })
      .andWhere('message.isRead = :isRead', { isRead: false })
      .getCount();
  }

  // Simple cache helper methods
  private getFromCache<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (cached && cached.expiry > Date.now()) {
      return cached.data;
    }
    if (cached) {
      this.cache.delete(key);
    }
    return null;
  }

  private setCache<T>(key: string, data: T, ttl: number = this.CACHE_TTL): void {
    this.cache.set(key, {
      data,
      expiry: Date.now() + ttl
    });
  }

  private invalidateCache(pattern: string): void {
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    }
  }

  // Utility method to get current Nairobi time
  getCurrentNairobiTime(): string {
    return DateTime.now().setZone('Africa/Nairobi').toISO();
  }
}
