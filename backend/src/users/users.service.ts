import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as argon2 from 'argon2';
import * as fsPromises from 'fs/promises';
import { join } from 'path';
import { Repository } from 'typeorm';
import { Game, GameStatus } from '../game/entities/game.entity';
import { User } from './entities/user.entity';
import { CreateUserDto } from './types/create-user.dto';
import { UpdateUserAvatarDto } from './types/update-user-avatar.dto';
import { UpdateUserDto } from './types/update-user.dto';

@Injectable()
export class UsersService {
  private readonly logger: Logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    @InjectRepository(Game) private readonly matchRepository: Repository<Game>,
  ) {}

  private generateUsername(user: CreateUserDto) {
    return `${user?.email.substring(
      0,
      user?.email.indexOf('@'),
    )}_${new Date().getTime()}`;
  }

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

  async getGameStats(userId: number) {
    const user = await this.findOne(userId);

    const games = await this.matchRepository.find({
      where: [
        { playerOne: { id: user.id }, status: GameStatus.FINISHED },
        { playerTwo: { id: user.id }, status: GameStatus.FINISHED },
      ],
    });

    const wins = games.filter(
      (game) =>
        (user.id === game.playerOne.id &&
          game.playerOneScore > game.playerTwoScore) ||
        (user.id === game.playerTwo.id &&
          game.playerTwoScore > game.playerOneScore),
    ).length;

    return {
      gamesPlayed: games.length,
      wins: wins,
      losses: games.length - wins,
      rank: {
        level: 3,
        xp: 190,
        nextLevelXp: 20,
      },
    };
  }

  async getMatchHistory(userId: number) {
    const user = await this.findOne(userId);

    const games = await this.matchRepository.find({
      where: [{ playerOne: { id: user.id } }, { playerTwo: { id: user.id } }],
    });

    return games.map((game) => {
      const opponent =
        game.playerOne.id === user.id ? game.playerTwo : game.playerOne;

      return {
        id: game.id,
        opponent: opponent.username,
        opponentAvatar: opponent.avatar,
        opponentScore:
          game.playerOne.id === user.id
            ? game.playerTwoScore
            : game.playerOneScore,
        userScore:
          game.playerOne.id === user.id
            ? game.playerOneScore
            : game.playerTwoScore,
        date: game.createdAt,
      };
    });
  }
}
