import { Inject } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import authConfig from 'src/config/auth.config';
import { CreateUserDto } from '../../users/types/create-user.dto';
import { UsersService } from '../../users/users.service';
import { JwtAuthService } from '../jwt/jwt.service';
import { IntraUserProfile } from './intra.strategy';

export class FortyTwoOauthService {
  constructor(
    @Inject(authConfig.KEY) authConf: ConfigType<typeof authConfig>,
    private jwtAuthService: JwtAuthService,
    private usersService: UsersService,
  ) {}

  async fortyTwoSignIn(profile: IntraUserProfile) {
    let user = await this.usersService.findOneByEmail(profile.email);

    // Check if user is already registered
    if (!user) {
      const newUser: CreateUserDto = { ...profile };
      user = await this.usersService.create(newUser);
    }

    return this.jwtAuthService.generateJwt(user);
  }
}
