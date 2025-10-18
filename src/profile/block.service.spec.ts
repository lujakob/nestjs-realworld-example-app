import { Test, TestingModule } from "@nestjs/testing";
import { BlockService } from "./block.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { UserEntity } from "../user/user.entity";
import { UserBlockEntity } from "../user/user-block.entity";
import { HttpException, HttpStatus } from "@nestjs/common";

describe("BlockService", () => {
  let service: BlockService;
  let userRepository: any;
  let userBlockRepository: any;

  const mockUser1 = {
    id: 1,
    email: "user1@example.com",
    username: "user1",
    bio: "test bio",
    image: "test.jpg",
  };

  const mockUser2 = {
    id: 2,
    email: "user2@example.com",
    username: "user2",
    bio: "test bio 2",
    image: "test2.jpg",
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BlockService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(UserBlockEntity),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<BlockService>(BlockService);
    userRepository = module.get(getRepositoryToken(UserEntity));
    userBlockRepository = module.get(getRepositoryToken(UserBlockEntity));
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("blockUser", () => {
    it("should block a user successfully", async () => {
      userRepository.findOne
        .mockResolvedValueOnce({ ...mockUser2 }) // target user
        .mockResolvedValueOnce({ ...mockUser1 }); // blocker user
      userBlockRepository.findOne.mockResolvedValue(null);
      userBlockRepository.save.mockResolvedValue({
        blocker: mockUser1,
        blocked: mockUser2,
      });

      const result = await service.blockUser("user1@example.com", "user2");

      expect(result.profile).toEqual({
        username: mockUser2.username,
        bio: mockUser2.bio,
        image: mockUser2.image,
        blocked: true,
      });
    });

    it("should throw error when trying to block yourself", async () => {
      userRepository.findOne
        .mockResolvedValueOnce(mockUser1)
        .mockResolvedValueOnce(mockUser1);

      await expect(
        service.blockUser("user1@example.com", "user1")
      ).rejects.toThrow(
        new HttpException(
          "Users cannot block themselves",
          HttpStatus.BAD_REQUEST
        )
      );
    });

    it("should throw error when user not found", async () => {
      userRepository.findOne
        .mockResolvedValueOnce(mockUser1)
        .mockResolvedValueOnce(null);

      await expect(
        service.blockUser("user1@example.com", "nonexistent")
      ).rejects.toThrow(
        new HttpException("User not found", HttpStatus.NOT_FOUND)
      );
    });
  });

  describe("unblockUser", () => {
    it("should unblock a user successfully", async () => {
      userRepository.findOne
        .mockResolvedValueOnce({ ...mockUser2 }) // target user
        .mockResolvedValueOnce({ ...mockUser1 }); // blocker user
      userBlockRepository.delete.mockResolvedValue({ affected: 1 });

      const result = await service.unblockUser("user1@example.com", "user2");

      expect(result.profile).toEqual({
        username: mockUser2.username,
        bio: mockUser2.bio,
        image: mockUser2.image,
        blocked: false,
      });
    });
  });

  describe("getBlockedUsers", () => {
    it("should return list of blocked users", async () => {
      userRepository.findOne.mockResolvedValue(mockUser1);
      userBlockRepository.find.mockResolvedValue([
        {
          blocker: mockUser1,
          blocked: mockUser2,
        },
      ]);

      const result = await service.getBlockedUsers("user1@example.com");

      expect(result).toEqual([
        {
          profile: {
            username: mockUser2.username,
            bio: mockUser2.bio,
            image: mockUser2.image,
            blocked: true,
          },
        },
      ]);
    });  
  });
});
