import { Staff } from './staff.entity';
import { ChatMessage } from './chat-message.entity';
export declare class ChatRoom {
    id: number;
    name?: string;
    description?: string;
    isGroup: boolean;
    createdBy: number;
    createdAt: Date;
    members?: Staff[];
    messages?: ChatMessage[];
}
