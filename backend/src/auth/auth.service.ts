import { BadRequestException, Inject, Injectable, InternalServerErrorException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Repository } from "typeorm";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { User } from "../users/entities/user.entity";

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @Inject('USER_REPOSITORY') private userRepository: Repository<User>,
  ) { }

  generateJwt(payload): string {
    return this.jwtService.sign(payload);
  }

  async signIn(user: User) {
    if (!user) {
      throw new BadRequestException('Unauthenticated');
    }

    const userExists = await this.findUserByEmail(user.email);

    if (!userExists) {
      return this.registerUser(user);
    }

    return this.generateJwt({
      sub: userExists.id,
      email: userExists.email,
    });
  }

  async registerUser(user: CreateUserDto): Promise<string> {
    try {
      const newUser = this.userRepository.create(user);
      newUser.username = user.email.match(/^(.+)@/)[1]

      await this.userRepository.save(newUser);

      return this.generateJwt({
        sub: newUser.id,
        email: newUser.email,
      });
    } catch {
      throw new InternalServerErrorException();
    }
  }

  async findUserByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ email });

    if (!user) {
      return null;
    }

    return user;
  }
}