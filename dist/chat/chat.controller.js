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
exports.ChatController = void 0;
const common_1 = require("@nestjs/common");
const chat_service_1 = require("./chat.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let ChatController = class ChatController {
    chatService;
    constructor(chatService) {
        this.chatService = chatService;
    }
    async createChatRoom(createRoomDto) {
        console.log('🔍 [ChatController] createChatRoom called with:', createRoomDto);
        return this.chatService.createChatRoom(createRoomDto);
    }
    async getChatRooms(req) {
        const userId = req.user.sub;
        console.log('🔍 [ChatController] getChatRooms endpoint called for user:', userId);
        return this.chatService.getChatRoomsByUser(userId);
    }
    async getChatRoom(roomId, req) {
        const userId = req.user.sub;
        return this.chatService.getChatRoomById(roomId, userId);
    }
    async getMessages(roomId, req, limit, offset) {
        const userId = req.user.sub;
        const messageLimit = limit ? Math.min(limit, 100) : 50;
        const messageOffset = offset || 0;
        return this.chatService.getMessagesByRoom(roomId, userId, messageLimit, messageOffset);
    }
    async getNewMessages(roomId, req, lastMessageId) {
        const userId = req.user.sub;
        return this.chatService.getNewMessages(roomId, userId, lastMessageId);
    }
    async sendMessage(sendMessageDto) {
        return this.chatService.sendMessage(sendMessageDto);
    }
    async getAllStaff() {
        console.log('🔍 [ChatController] getAllStaff endpoint called');
        return this.chatService.getAllStaff();
    }
    async markMessageAsRead(messageId, req) {
        const userId = req.user.sub;
        await this.chatService.markMessageAsRead(messageId, userId);
        return { success: true };
    }
    async getCurrentTime() {
        return {
            nairobiTime: this.chatService.getCurrentNairobiTime(),
            timezone: 'Africa/Nairobi'
        };
    }
};
exports.ChatController = ChatController;
__decorate([
    (0, common_1.Post)('rooms'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "createChatRoom", null);
__decorate([
    (0, common_1.Get)('rooms'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getChatRooms", null);
__decorate([
    (0, common_1.Get)('rooms/:roomId'),
    __param(0, (0, common_1.Param)('roomId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getChatRoom", null);
__decorate([
    (0, common_1.Get)('rooms/:roomId/messages'),
    __param(0, (0, common_1.Param)('roomId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('offset')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Number, Number]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getMessages", null);
__decorate([
    (0, common_1.Get)('rooms/:roomId/messages/new'),
    __param(0, (0, common_1.Param)('roomId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Query)('lastMessageId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Number]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getNewMessages", null);
__decorate([
    (0, common_1.Post)('messages'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "sendMessage", null);
__decorate([
    (0, common_1.Get)('staff'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getAllStaff", null);
__decorate([
    (0, common_1.Post)('messages/:messageId/read'),
    __param(0, (0, common_1.Param)('messageId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "markMessageAsRead", null);
__decorate([
    (0, common_1.Get)('timezone/current'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getCurrentTime", null);
exports.ChatController = ChatController = __decorate([
    (0, common_1.Controller)('chat'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [chat_service_1.ChatService])
], ChatController);
//# sourceMappingURL=chat.controller.js.map