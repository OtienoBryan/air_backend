import { ChatService } from './chat.service';
import type { CreateChatRoomDto, SendMessageDto } from './chat.service';
export declare class ChatController {
    private readonly chatService;
    constructor(chatService: ChatService);
    createChatRoom(createRoomDto: CreateChatRoomDto): Promise<import("../entities").ChatRoom>;
    getChatRooms(req: any): Promise<import("../entities").ChatRoom[]>;
    getChatRoom(roomId: number, req: any): Promise<import("../entities").ChatRoom | null>;
    getMessages(roomId: number, req: any, limit?: number, offset?: number): Promise<import("../entities").ChatMessage[]>;
    getNewMessages(roomId: number, req: any, lastMessageId: number): Promise<import("../entities").ChatMessage[]>;
    sendMessage(sendMessageDto: SendMessageDto): Promise<import("../entities").ChatMessage>;
    getAllStaff(): Promise<import("../entities").Staff[]>;
    markMessageAsRead(messageId: number, req: any): Promise<{
        success: boolean;
    }>;
    getCurrentTime(): Promise<{
        nairobiTime: string;
        timezone: string;
    }>;
}
