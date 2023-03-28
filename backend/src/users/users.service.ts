import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as argon2 from 'argon2';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './types/create-user.dto';
import { UpdateUserAvatarDto } from './types/update-user-avatar.dto';
import { UpdateUserDto } from './types/update-user.dto';
import * as fsPromises from 'fs/promises';
import { join } from 'path';

@Injectable()
export class UsersService {
  private readonly logger: Logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id: +id } });

    if (!user) {
      throw new NotFoundException(`User ID ${id} not found`);
    }

    return user;
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email: email } });
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const username =
      createUserDto.username ?? this.generateUsername(createUserDto);
    const user = this.usersRepository.create({ ...createUserDto, username });
    return this.usersRepository.save(user);
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    if (updateUserDto.username) {
      const userByUsername = await this.usersRepository.findOneBy({
        username: updateUserDto.username,
      });

      if (userByUsername && userByUsername.id !== +id)
        throw new ConflictException(
          `Username ${updateUserDto.username} already exists!`,
        );
    }

    const { password, ...rest } = updateUserDto;
    const user = await this.usersRepository.preload({
      id: +id,
      ...(password ? { password: await argon2.hash(password) } : {}),
      ...rest,
    });

    if (!user) {
      throw new NotFoundException(`User ID ${id} not found`);
    }

    return this.usersRepository.save(user);
  }

  async updateAvatar(
    id: number,
    updateUserAvatarDto: UpdateUserAvatarDto,
  ): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id: +id } });

    if (!user) throw new NotFoundException(`User ID ${id} not found`);

    const updatedUser = await this.usersRepository.preload({
      id: +id,
      ...updateUserAvatarDto,
    });

    if (user.avatar) {
      const filePath = join(
        __dirname,
        '../..',
        process.env.USER_PICTURE_PATH,
        user.avatar,
      );

      try {
        await fsPromises.unlink(filePath);
      } catch (err) {
        throw new InternalServerErrorException(
          `Server could not delete ${filePath}`,
        );
      }
    }

    return this.usersRepository.save(updatedUser);
  }

  async remove(id: number) {
    const user = await this.usersRepository.findOne({ where: { id: +id } });
    if (!user) {
      throw new NotFoundException(`User ID ${id} not found`);
    }

    return this.usersRepository.remove(user);
  }

  async setTwoFactorAuthenticationSecret(secret: string, userId: number) {
    return this.usersRepository.update(userId, {
      mfaSecret: secret,
    });
  }

  private generateUsername(user: CreateUserDto) {
    return `${user?.email.substring(
      0,
      user?.email.indexOf('@'),
    )}_${new Date().getTime()}`;
  }
}
