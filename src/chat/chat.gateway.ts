import { Injectable } from '@nestjs/common';
import { ChatService } from './chat.service';

@Injectable()
export class ChatGateway {
  constructor(
    private chatService: ChatService,
  ) {}

  // Placeholder for WebSocket functionality
  // Will be implemented once WebSocket dependencies are installed
}
