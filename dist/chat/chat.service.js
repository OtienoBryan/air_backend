"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const luxon_1 = require("luxon");
const entities_1 = require("../entities");
let ChatService = class ChatService {
    chatRoomRepository;
    chatMessageRepository;
    staffRepository;
    cache = new Map();
    CACHE_TTL = 5 * 60 * 1000;
    constructor(chatRoomRepository, chatMessageRepository, staffRepository) {
        this.chatRoomRepository = chatRoomRepository;
        this.chatMessageRepository = chatMessageRepository;
        this.staffRepository = staffRepository;
    }
    async createChatRoom(createRoomDto) {
        const { name, description, memberIds, createdBy } = createRoomDto;
        console.log('🔍 [ChatService] Creating chat room:', { name, description, memberIds, createdBy });
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
    async getChatRoomsByUser(userId) {
        console.log('🔍 [ChatService] Getting chat rooms for user:', userId);
        try {
            const cacheKey = `chat_rooms_user_${userId}`;
            const cachedRooms = this.getFromCache(cacheKey);
            if (cachedRooms) {
                console.log('💬 [ChatService] Returning cached chat rooms:', cachedRooms.length);
                return cachedRooms;
            }
            const rooms = await this.chatRoomRepository
                .createQueryBuilder('room')
                .leftJoin('room.members', 'members')
                .where('members.id = :userId', { userId })
                .orderBy('room.createdAt', 'DESC')
                .getMany();
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
            this.setCache(cacheKey, rooms, 300000);
            console.log('💬 [ChatService] Chat rooms found:', rooms.length, rooms.map(r => ({
                id: r.id,
                name: r.name,
                memberCount: r.members?.length || 0,
                members: r.members?.map(m => ({ id: m.id, name: m.name })) || []
            })));
            return rooms;
        }
        catch (error) {
            console.error('❌ [ChatService] Error getting chat rooms:', error);
            throw error;
        }
    }
    async getChatRoomById(roomId, userId) {
        const userIsMember = await this.chatRoomRepository
            .createQueryBuilder('room')
            .leftJoin('room.members', 'members')
            .where('room.id = :roomId', { roomId })
            .andWhere('members.id = :userId', { userId })
            .getCount() > 0;
        if (!userIsMember) {
            return null;
        }
        return this.chatRoomRepository
            .createQueryBuilder('room')
            .leftJoinAndSelect('room.members', 'members')
            .leftJoinAndSelect('room.messages', 'messages')
            .leftJoinAndSelect('messages.sender', 'sender')
            .where('room.id = :roomId', { roomId })
            .getOne();
    }
    async sendMessage(sendMessageDto) {
        const { chatRoomId, content, senderId, messageType = 'text' } = sendMessageDto;
        const chatRoom = await this.getChatRoomById(chatRoomId, senderId);
        if (!chatRoom) {
            throw new Error('User is not a member of this chat room');
        }
        const message = this.chatMessageRepository.create({
            content,
            messageType,
            chatRoomId,
            senderId,
            createdAt: luxon_1.DateTime.now().setZone('Africa/Nairobi').toJSDate()
        });
        const savedMessage = await this.chatMessageRepository.save(message);
        this.invalidateCache(`messages_room_${chatRoomId}`);
        this.invalidateCache(`chat_rooms_user_${senderId}`);
        return savedMessage;
    }
    async getMessagesByRoom(roomId, userId, limit = 50, offset = 0) {
        const chatRoom = await this.getChatRoomById(roomId, userId);
        if (!chatRoom) {
            throw new Error('User is not a member of this chat room');
        }
        const cacheKey = `messages_room_${roomId}_${offset}_${limit}`;
        const cachedMessages = this.getFromCache(cacheKey);
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
        this.setCache(cacheKey, messages, 120000);
        return messages;
    }
    async getNewMessages(roomId, userId, lastMessageId) {
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
    async getAllStaff() {
        console.log('🔍 [ChatService] Getting all staff members...');
        const cacheKey = 'all_staff_members';
        const cachedStaff = this.getFromCache(cacheKey);
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
        this.setCache(cacheKey, staff, 600000);
        console.log('👥 [ChatService] Staff members found:', staff.length, staff);
        return staff;
    }
    async markMessageAsRead(messageId, userId) {
        await this.chatMessageRepository.update({ id: messageId }, { isRead: true, readAt: luxon_1.DateTime.now().setZone('Africa/Nairobi').toJSDate() });
    }
    async getUnreadMessageCount(roomId, userId) {
        return this.chatMessageRepository
            .createQueryBuilder('message')
            .where('message.chatRoomId = :roomId', { roomId })
            .andWhere('message.senderId != :userId', { userId })
            .andWhere('message.isRead = :isRead', { isRead: false })
            .getCount();
    }
    getFromCache(key) {
        const cached = this.cache.get(key);
        if (cached && cached.expiry > Date.now()) {
            return cached.data;
        }
        if (cached) {
            this.cache.delete(key);
        }
        return null;
    }
    setCache(key, data, ttl = this.CACHE_TTL) {
        this.cache.set(key, {
            data,
            expiry: Date.now() + ttl
        });
    }
    invalidateCache(pattern) {
        for (const key of this.cache.keys()) {
            if (key.includes(pattern)) {
                this.cache.delete(key);
            }
        }
    }
    getCurrentNairobiTime() {
        return luxon_1.DateTime.now().setZone('Africa/Nairobi').toISO();
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.ChatRoom)),
    __param(1, (0, typeorm_1.InjectRepository)(entities_1.ChatMessage)),
    __param(2, (0, typeorm_1.InjectRepository)(entities_1.Staff)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ChatService);
//# sourceMappingURL=chat.service.js.map