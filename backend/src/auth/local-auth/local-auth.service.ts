import { BadRequestException, Injectable } from "@nestjs/common";
import * as argon2 from 'argon2';
import { CreateUserDto } from "src/users/dto/create-user.dto";
import { User } from "src/users/entities/user.entity";
import { UsersService } from "src/users/users.service";
import { AuthTokenDto } from "../dto/auth-token.dto";
import { JwtAuthService } from "../jwt/jwt.service";

@Injectable()
export class LocalAuthService {
  constructor(
    private jwtAuthService: JwtAuthService,
    private usersService: UsersService
  ) { }

  async signIn(user: User) {
    const tokens = await this.jwtAuthService.getTokens(user);
    await this.jwtAuthService.updateRefreshToken(user, tokens.refreshToken);

    return tokens;
  }

  async signUp(user: CreateUserDto): Promise<AuthTokenDto> {
    // Check if user exists
    const userExists = await this.usersService.findOneByEmail(user.email);

    if (userExists) {
      throw new BadRequestException('User already exists');
    }

    // Hash password
    const hash = await argon2.hash(user.password);
    const newUser = await this.usersService.create({
      ...user,
      password: hash,
    });
    const tokens = await this.jwtAuthService.getTokens(newUser);
    await this.jwtAuthService.updateRefreshToken(newUser, tokens.refreshToken);

    return tokens;
  }

  async validateUser(email: string, pass: string): Promise<User | null> {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      throw new BadRequestException('Users does not exist');
    }

    const passwordMatches = await argon2.verify(user.password, pass);
    if (!passwordMatches)
      throw new BadRequestException('Password is incorrect');

    const { password, ...result } = user;
    return result;
  }
}