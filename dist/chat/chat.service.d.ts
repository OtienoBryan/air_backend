import { Repository } from 'typeorm';
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
export declare class ChatService {
    private chatRoomRepository;
    private chatMessageRepository;
    private staffRepository;
    private cache;
    private readonly CACHE_TTL;
    constructor(chatRoomRepository: Repository<ChatRoom>, chatMessageRepository: Repository<ChatMessage>, staffRepository: Repository<Staff>);
    createChatRoom(createRoomDto: CreateChatRoomDto): Promise<ChatRoom>;
    getChatRoomsByUser(userId: number): Promise<ChatRoom[]>;
    getChatRoomById(roomId: number, userId: number): Promise<ChatRoom | null>;
    sendMessage(sendMessageDto: SendMessageDto): Promise<ChatMessage>;
    getMessagesByRoom(roomId: number, userId: number, limit?: number, offset?: number): Promise<ChatMessage[]>;
    getNewMessages(roomId: number, userId: number, lastMessageId: number): Promise<ChatMessage[]>;
    getAllStaff(): Promise<Staff[]>;
    markMessageAsRead(messageId: number, userId: number): Promise<void>;
    getUnreadMessageCount(roomId: number, userId: number): Promise<number>;
    private getFromCache;
    private setCache;
    private invalidateCache;
    getCurrentNairobiTime(): string;
}
