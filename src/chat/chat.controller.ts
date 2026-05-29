import { Controller, Get, Post, Body, Param, ParseIntPipe, UseGuards, Request, Query } from '@nestjs/common';
import { ChatService } from './chat.service';
import type { CreateChatRoomDto, SendMessageDto } from './chat.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('rooms')
  async createChatRoom(@Body() createRoomDto: CreateChatRoomDto) {
    console.log('🔍 [ChatController] createChatRoom called with:', createRoomDto);
    return this.chatService.createChatRoom(createRoomDto);
  }

  @Get('rooms')
  async getChatRooms(@Request() req) {
    const userId = req.user.sub;
    console.log('🔍 [ChatController] getChatRooms endpoint called for user:', userId);
    return this.chatService.getChatRoomsByUser(userId);
  }

  @Get('rooms/:roomId')
  async getChatRoom(
    @Param('roomId', ParseIntPipe) roomId: number,
    @Request() req
  ) {
    const userId = req.user.sub;
    return this.chatService.getChatRoomById(roomId, userId);
  }

  @Get('rooms/:roomId/messages')
  async getMessages(
    @Param('roomId', ParseIntPipe) roomId: number,
    @Request() req,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number
  ) {
    const userId = req.user.sub;
    const messageLimit = limit ? Math.min(limit, 100) : 50; // Cap at 100 messages
    const messageOffset = offset || 0;
    return this.chatService.getMessagesByRoom(roomId, userId, messageLimit, messageOffset);
  }

  @Get('rooms/:roomId/messages/new')
  async getNewMessages(
    @Param('roomId', ParseIntPipe) roomId: number,
    @Request() req,
    @Query('lastMessageId', ParseIntPipe) lastMessageId: number
  ) {
    const userId = req.user.sub;
    return this.chatService.getNewMessages(roomId, userId, lastMessageId);
  }

  @Post('messages')
  async sendMessage(@Body() sendMessageDto: SendMessageDto) {
    return this.chatService.sendMessage(sendMessageDto);
  }

  @Get('staff')
  async getAllStaff() {
    console.log('🔍 [ChatController] getAllStaff endpoint called');
    return this.chatService.getAllStaff();
  }

  @Post('messages/:messageId/read')
  async markMessageAsRead(
    @Param('messageId', ParseIntPipe) messageId: number,
    @Request() req
  ) {
    const userId = req.user.sub;
    await this.chatService.markMessageAsRead(messageId, userId);
    return { success: true };
  }

  @Get('timezone/current')
  async getCurrentTime() {
    return {
      nairobiTime: this.chatService.getCurrentNairobiTime(),
      timezone: 'Africa/Nairobi'
    };
  }
}
