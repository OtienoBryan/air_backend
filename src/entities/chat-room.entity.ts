import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, OneToMany, JoinTable, CreateDateColumn } from 'typeorm';
import { Staff } from './staff.entity';
import { ChatMessage } from './chat-message.entity';

@Entity('chat_rooms')
export class ChatRoom {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  name?: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ name: 'is_group', default: false })
  isGroup: boolean;

  @Column({ name: 'created_by' })
  createdBy: number; // Staff ID who created the room

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToMany(() => Staff, { eager: false })
  @JoinTable({
    name: 'chat_room_members',
    joinColumn: { name: 'room_id' },
    inverseJoinColumn: { name: 'staff_id' }
  })
  members?: Staff[];

  @OneToMany(() => ChatMessage, message => message.chatRoom, { eager: false })
  messages?: ChatMessage[];
}
