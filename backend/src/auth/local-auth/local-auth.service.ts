import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as argon2 from 'argon2';
import { UsersService } from 'src/users/users.service';
import { User } from '../../users/entities/user.entity';
import { CreateUserDto } from '../../users/types/create-user.dto';
import { JwtAuthService } from '../jwt/jwt.service';
import { AuthTokenDto } from '../types/auth-token.dto';

@Injectable()
export class LocalAuthService {
  constructor(
    private jwtAuthService: JwtAuthService,
    private usersService: UsersService,
  ) {}

  async signIn(user: User): Promise<AuthTokenDto> {
    return await this.jwtAuthService.generateJwt(user);
  }

  async signUp(user: CreateUserDto) {
    // Check if user exists
    const userExists = await this.usersService.findOneByEmail(user.email);

    if (userExists) throw new ConflictException('User already exists');

    // Hash password
    if (!user.password)
      throw new BadRequestException('Password cannot be empty');
    const hashedPassword = await argon2.hash(user.password);

    const newUser = await this.usersService.create({
      ...user,
      password: hashedPassword,
    });

    return await this.jwtAuthService.generateJwt(newUser);
  }

  async validateUser(
    email: string,
    pass: string,
  ): Promise<Omit<User, 'getAvatarUrl'> | null> {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      throw new BadRequestException('User does not exist');
    }

    const passwordMatches = await argon2.verify(user.password, pass);
    if (!passwordMatches)
      throw new UnauthorizedException('Password is incorrect');

    const { password, ...result } = user;
    return result;
  }
}
