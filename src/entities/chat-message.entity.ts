import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ChatRoom } from './chat-room.entity';
import { Staff } from './staff.entity';

@Entity('chat_messages')
export class ChatMessage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'message', type: 'text' })
  content: string;

  @Column({ nullable: true })
  messageType?: string; // 'text', 'image', 'file', etc.

  @ManyToOne(() => ChatRoom, room => room.messages, { eager: false })
  @JoinColumn({ name: 'room_id' })
  chatRoom?: ChatRoom;

  @Column({ name: 'room_id' })
  chatRoomId: number;

  @ManyToOne(() => Staff, { eager: false })
  @JoinColumn({ name: 'sender_id' })
  sender?: Staff;

  @Column({ name: 'sender_id' })
  senderId: number;

  @Column({ default: false })
  isRead?: boolean;

  @Column({ nullable: true })
  readAt?: Date;

  @Column({ name: 'sent_at' })
  createdAt: Date;
}
