import { Test, TestingModule } from '@nestjs/testing';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { ProfileRO } from './profile.interface';

describe('ProfileController', () => {
  let controller: ProfileController;
  let service: jest.Mocked<ProfileService>;

  const mockProfileService = {
    findProfile: jest.fn(),
    follow: jest.fn(),
    unFollow: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfileController],
      providers: [
        { provide: ProfileService, useValue: mockProfileService },
      ],
    }).compile();

    controller = module.get<ProfileController>(ProfileController);
    service = module.get(ProfileService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should get a profile', async () => {
    const result: ProfileRO = { profile: { username: 'john', bio: '', following: false } };
    service.findProfile.mockResolvedValue(result);
    expect(await controller.getProfile(1, 'john')).toBe(result);
    expect(service.findProfile).toHaveBeenCalledWith(1, 'john');
  });

  it('should follow a user', async () => {
    const result: ProfileRO = { profile: { username: 'john', bio: '', following: true } };
    service.follow.mockResolvedValue(result);
    expect(await controller.follow('test@email.com', 'john')).toBe(result);
    expect(service.follow).toHaveBeenCalledWith('test@email.com', 'john');
  });

  it('should unfollow a user', async () => {
    const result: ProfileRO = { profile: { username: 'john', bio: '', following: false } };
    service.unFollow.mockResolvedValue(result);
    expect(await controller.unFollow(1, 'john')).toBe(result);
    expect(service.unFollow).toHaveBeenCalledWith(1, 'john');
  });
});