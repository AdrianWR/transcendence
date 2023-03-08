import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { User } from 'src/users/entities/user.entity';
import { LocalAuthService } from './local-auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private localAuthService: LocalAuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<User> {
    const user = await this.localAuthService.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException('User not registered.');
    }
    return user;
  }
}
