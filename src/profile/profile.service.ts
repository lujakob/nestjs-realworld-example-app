import { HttpStatus, Injectable} from '@nestjs/common';
import { ProfileRO } from './profile.interface';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { PrismaService } from '../shared/services/prisma.service';

const profileSelect = {
  username: true,
  bio: true,
  image: true,
  id: true
};

@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService) {}

  async findProfile(userId: number, followingUsername: string): Promise<any> {
    const followed = await this.prisma.user.findOne({
      where: { username: followingUsername },
      select: profileSelect
    });

    if (!followed) {
      throw new HttpException({errors: { user: 'not found' }}, HttpStatus.UNPROCESSABLE_ENTITY);
    }

    const meFollowing = await this.prisma.user.findMany({
      where: {
        AND: [
          {
            id: followed.id
          },
          {
            followedBy: {
              some: { id: +userId }
            }
          }
        ]
      }
    });

    const { id, ...rest } = followed;
    const profile = {
      ...rest,
      following: Array.isArray(meFollowing) && meFollowing.length > 0
    };

    return { profile };
  }

  async follow(userId: string, username: string): Promise<any> {
    if (!username) {
      throw new HttpException('Follower username not provided.', HttpStatus.BAD_REQUEST);
    }

    const followed = await this.prisma.user.findOne({
      where: { username },
      select: profileSelect,
    });

    if (!followed) {
      throw new HttpException('User to follow not found.', HttpStatus.UNPROCESSABLE_ENTITY);
    }

    await this.prisma.user.update({
      where: { id: +userId },
      data: {
        following: {
          connect: {
            id: followed.id
          }
        }
      }
    });

    const { id, ...rest } = followed;
    const profile = {
      ...rest,
      following: true
    };

    return { profile };
  }

  async unFollow(userId: number, username: string): Promise<ProfileRO> {
    if (!username) {
      throw new HttpException('Follower username not provided.', HttpStatus.BAD_REQUEST);
    }

    const followed = await this.prisma.user.findOne({
      where: { username },
      select: profileSelect,
    });

    if (!followed) {
      throw new HttpException('User to follow not found.', HttpStatus.UNPROCESSABLE_ENTITY);
    }

    await this.prisma.user.update({
      where: { id: +userId },
      data: {
        following: {
          disconnect: {
            id: followed.id
          }
        }
      }
    });

    const { id, ...rest } = followed;
    const profile = {
      ...rest,
      following: false
    };

    return { profile };
  }
}
