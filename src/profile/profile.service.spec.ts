import { Test, TestingModule } from '@nestjs/testing';
import { ProfileService } from './profile.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from '../user/user.entity';
import { FollowsEntity } from './follows.entity';
import { Repository } from 'typeorm';
import { HttpException } from '@nestjs/common';

describe('ProfileService', () => {
  let service: ProfileService;
  let userRepository: jest.Mocked<Partial<Repository<UserEntity>>>;
  let followsRepository: jest.Mocked<Partial<Repository<FollowsEntity>>>;

  beforeEach(async () => {
    userRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
    };
    followsRepository = {
      findOne: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfileService,
        { provide: getRepositoryToken(UserEntity), useValue: userRepository },
        { provide: getRepositoryToken(FollowsEntity), useValue: followsRepository },
      ],
    }).compile();

    service = module.get<ProfileService>(ProfileService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all users', async () => {
    const users = [{ id: 1, username: 'john' }];
    (userRepository.find as jest.Mock).mockResolvedValue(users);
    const result = await service.findAll();
    expect(result).toBe(users);
    expect(userRepository.find).toHaveBeenCalled();
  });

  it('should return a profile by options', async () => {
    const user = { id: 1, username: 'john', password: 'pass', bio: '', image: '' };
    (userRepository.findOne as jest.Mock).mockResolvedValue(user);
    const result = await service.findOne({ username: 'john' });
    expect(result.profile.username).toBe('john');
  });

  it('should return a profile with following true if followed', async () => {
    const user = { id: 2, username: 'john', bio: '', image: '' };
    (userRepository.findOne as jest.Mock).mockResolvedValueOnce(user);
    (followsRepository.findOne as jest.Mock).mockResolvedValueOnce({ id: 1 });
    const result = await service.findProfile(1, 'john');
    expect(result.profile.username).toBe('john');
    expect(result.profile.following).toBe(true);
  });

  it('should return a profile with following false if not followed', async () => {
    const user = { id: 2, username: 'john', bio: '', image: '' };
    (userRepository.findOne as jest.Mock).mockResolvedValueOnce(user);
    (followsRepository.findOne as jest.Mock).mockResolvedValueOnce(undefined);
    const result = await service.findProfile(1, 'john');
    expect(result.profile.username).toBe('john');
    expect(result.profile.following).toBe(false);
  });

  it('should follow a user', async () => {
    const followingUser = { id: 2, username: 'john', bio: '', image: '', email: 'john@email.com' };
    const followerUser = { id: 1, username: 'bob', bio: '', image: '', email: 'bob@email.com' };
    (userRepository.findOne as jest.Mock)
      .mockResolvedValueOnce(followingUser)
      .mockResolvedValueOnce(followerUser);
    (followsRepository.findOne as jest.Mock).mockResolvedValueOnce(undefined);
    (followsRepository.save as jest.Mock).mockResolvedValueOnce({});
    const result = await service.follow('bob@email.com', 'john');
    expect(result.profile.username).toBe('john');
    expect(result.profile.following).toBe(true);
    expect(followsRepository.save).toHaveBeenCalled();
  });

  it('should not follow if followerEmail and username are missing', async () => {
    await expect(service.follow('', '')).rejects.toThrow(HttpException);
  });

  it('should not follow if followerEmail and followingUser are the same', async () => {
    const followingUser = { id: 2, username: 'john', bio: '', image: '', email: 'same@email.com' };
    const followerUser = { id: 1, username: 'bob', bio: '', image: '', email: 'same@email.com' };
    (userRepository.findOne as jest.Mock)
      .mockResolvedValueOnce(followingUser)
      .mockResolvedValueOnce(followerUser);
    await expect(service.follow('same@email.com', 'john')).rejects.toThrow(HttpException);
  });

  it('should unfollow a user', async () => {
    const followingUser = { id: 2, username: 'john', bio: '', image: '', email: 'john@email.com' };
    (userRepository.findOne as jest.Mock).mockResolvedValueOnce(followingUser);
    (followsRepository.delete as jest.Mock).mockResolvedValueOnce({});
    const result = await service.unFollow(1, 'john');
    expect(result.profile.username).toBe('john');
    expect(result.profile.following).toBe(false);
    expect(followsRepository.delete).toHaveBeenCalledWith({ followerId: 1, followingId: 2 });
  });

  it('should not unfollow if followerId and username are missing', async () => {
    await expect(service.unFollow(undefined as any, '')).rejects.toThrow(HttpException);
  });

  it('should not unfollow if followerId and followingUser.id are the same', async () => {
    const followingUser = { id: 1, username: 'john', bio: '', image: '', email: 'john@email.com' };
    (userRepository.findOne as jest.Mock).mockResolvedValueOnce(followingUser);
    await expect(service.unFollow(1, 'john')).rejects.toThrow(HttpException);
  });
});