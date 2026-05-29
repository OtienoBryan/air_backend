import { ChatRoom } from './chat-room.entity';
import { Staff } from './staff.entity';
export declare class ChatMessage {
    id: number;
    content: string;
    messageType?: string;
    chatRoom?: ChatRoom;
    chatRoomId: number;
    sender?: Staff;
    senderId: number;
    isRead?: boolean;
    readAt?: Date;
    createdAt: Date;
}
