import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ChatService } from './chat.service';
import { ChatRoom } from '../entities/chat-room.entity';
import { ChatMessage } from '../entities/chat-message.entity';
import { Staff } from '../entities/staff.entity';

describe('ChatService', () => {
  let service: ChatService;
  let chatRoomRepository: any;
  let chatMessageRepository: any;
  let staffRepository: any;

  const mockStaff = {
    id: 1,
    name: 'John Doe',
    business_email: 'john@example.com',
    is_active: 1
  };

  const mockChatRoom = {
    id: 1,
    name: 'Test Room',
    description: 'A test chat room',
    isGroup: true,
    createdBy: 1,
    createdAt: new Date(),
    members: [mockStaff]
  };

  const mockChatMessage = {
    id: 1,
    content: 'Hello world!',
    messageType: 'text',
    chatRoomId: 1,
    senderId: 1,
    isRead: false,
    readAt: null,
    createdAt: new Date()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatService,
        {
          provide: getRepositoryToken(ChatRoom),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
            create: jest.fn(),
            delete: jest.fn(),
            createQueryBuilder: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(ChatMessage),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
            create: jest.fn(),
            delete: jest.fn(),
            update: jest.fn(),
            count: jest.fn(),
            createQueryBuilder: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Staff),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            findByIds: jest.fn(),
            createQueryBuilder: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ChatService>(ChatService);
    chatRoomRepository = module.get(getRepositoryToken(ChatRoom));
    chatMessageRepository = module.get(getRepositoryToken(ChatMessage));
    staffRepository = module.get(getRepositoryToken(Staff));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createChatRoom', () => {
    it('should create a new chat room successfully', async () => {
      // Arrange
      const createRoomDto = {
        name: 'Test Room',
        description: 'A test room',
        memberIds: [1, 2],
        createdBy: 1
      };

      const mockMembers = [
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Jane Doe' }
      ];

      staffRepository.createQueryBuilder.mockReturnValue({
        where: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockMembers)
      });
      chatRoomRepository.create.mockReturnValue(mockChatRoom);
      chatRoomRepository.save.mockResolvedValue(mockChatRoom);

      // Act
      const result = await service.createChatRoom(createRoomDto);

      // Assert
      expect(result).toEqual(mockChatRoom);
      expect(chatRoomRepository.create).toHaveBeenCalled();
      expect(chatRoomRepository.save).toHaveBeenCalled();
    });

    it('should handle creation errors gracefully', async () => {
      // Arrange
      const createRoomDto = {
        name: 'Test Room',
        description: 'A test room',
        memberIds: [1, 2],
        createdBy: 1
      };

      staffRepository.createQueryBuilder.mockReturnValue({
        where: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockRejectedValue(new Error('Database error'))
      });

      // Act & Assert
      await expect(service.createChatRoom(createRoomDto)).rejects.toThrow('Database error');
    });
  });

  describe('getChatRoomsByUser', () => {
    it('should return user chat rooms', async () => {
      // Arrange
      const mockRooms = [mockChatRoom];
      chatRoomRepository.createQueryBuilder.mockReturnValue({
        leftJoin: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockRooms),
        getOne: jest.fn().mockResolvedValue(mockChatRoom),
        getCount: jest.fn().mockResolvedValue(1)
      });

      // Act
      const result = await service.getChatRoomsByUser(1);

      // Assert
      expect(result).toEqual(mockRooms);
    });

    it('should handle empty results', async () => {
      // Arrange
      chatRoomRepository.createQueryBuilder.mockReturnValue({
        leftJoin: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([]),
        getOne: jest.fn().mockResolvedValue(null)
      });

      // Act
      const result = await service.getChatRoomsByUser(1);

      // Assert
      expect(result).toEqual([]);
    });

    it('should handle database errors gracefully', async () => {
      // Arrange
      chatRoomRepository.createQueryBuilder.mockReturnValue({
        leftJoin: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockRejectedValue(new Error('Database error')),
        getOne: jest.fn().mockRejectedValue(new Error('Database error'))
      });

      // Act & Assert
      await expect(service.getChatRoomsByUser(1)).rejects.toThrow('Database error');
    });
  });

  describe('getMessagesByRoom', () => {
    it('should return room messages with pagination', async () => {
      // Arrange
      const mockMessages = [mockChatMessage];
      chatRoomRepository.createQueryBuilder.mockReturnValue({
        leftJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(mockChatRoom),
        getCount: jest.fn().mockResolvedValue(1)
      });
      chatMessageRepository.createQueryBuilder.mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockMessages)
      });

      // Act
      const result = await service.getMessagesByRoom(1, 1, 10, 0);

      // Assert
      expect(result).toEqual(mockMessages);
    });

    it('should handle empty messages', async () => {
      // Arrange
      chatRoomRepository.createQueryBuilder.mockReturnValue({
        leftJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(mockChatRoom),
        getCount: jest.fn().mockResolvedValue(1)
      });
      chatMessageRepository.createQueryBuilder.mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([])
      });

      // Act
      const result = await service.getMessagesByRoom(1, 1, 10, 0);

      // Assert
      expect(result).toEqual([]);
    });

    it('should handle database errors gracefully', async () => {
      // Arrange
      chatRoomRepository.createQueryBuilder.mockReturnValue({
        leftJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockRejectedValue(new Error('Database error'))
      });

      // Act & Assert
      await expect(service.getMessagesByRoom(1, 1, 10, 0)).rejects.toThrow('Database error');
    });
  });

  describe('sendMessage', () => {
    it('should send a message successfully', async () => {
      // Arrange
      const sendMessageDto = {
        content: 'Hello world!',
        chatRoomId: 1,
        senderId: 1,
        messageType: 'text'
      };

      chatRoomRepository.createQueryBuilder.mockReturnValue({
        leftJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(mockChatRoom),
        getCount: jest.fn().mockResolvedValue(1)
      });
      chatMessageRepository.create.mockReturnValue(mockChatMessage);
      chatMessageRepository.save.mockResolvedValue(mockChatMessage);

      // Act
      const result = await service.sendMessage(sendMessageDto);

      // Assert
      expect(result).toEqual(mockChatMessage);
      expect(chatMessageRepository.create).toHaveBeenCalledWith(sendMessageDto);
      expect(chatMessageRepository.save).toHaveBeenCalledWith(mockChatMessage);
    });

    it('should handle send message errors gracefully', async () => {
      // Arrange
      const sendMessageDto = {
        content: 'Hello world!',
        chatRoomId: 1,
        senderId: 1,
        messageType: 'text'
      };

      chatRoomRepository.createQueryBuilder.mockReturnValue({
        leftJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockRejectedValue(new Error('Database error'))
      });

      // Act & Assert
      await expect(service.sendMessage(sendMessageDto)).rejects.toThrow('Database error');
    });
  });

  describe('getAllStaff', () => {
    it('should return all active staff members', async () => {
      // Arrange
      const mockStaffList = [mockStaff];
      staffRepository.createQueryBuilder.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockStaffList)
      });

      // Act
      const result = await service.getAllStaff();

      // Assert
      expect(result).toEqual(mockStaffList);
    });

    it('should handle empty staff list', async () => {
      // Arrange
      staffRepository.createQueryBuilder.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([])
      });

      // Act
      const result = await service.getAllStaff();

      // Assert
      expect(result).toEqual([]);
    });

    it('should handle database errors gracefully', async () => {
      // Arrange
      staffRepository.createQueryBuilder.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockRejectedValue(new Error('Database error'))
      });

      // Act & Assert
      await expect(service.getAllStaff()).rejects.toThrow('Database error');
    });
  });

  describe('markMessageAsRead', () => {
    it('should mark message as read successfully', async () => {
      // Arrange
      chatMessageRepository.update.mockResolvedValue({ affected: 1 });

      // Act
      await service.markMessageAsRead(1, 1);

      // Assert
      expect(chatMessageRepository.update).toHaveBeenCalledWith(
        { id: 1 },
        { isRead: true, readAt: expect.any(Date) }
      );
    });

    it('should handle database errors gracefully', async () => {
      // Arrange
      chatMessageRepository.update.mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(service.markMessageAsRead(1, 1)).rejects.toThrow('Database error');
    });
  });
});
