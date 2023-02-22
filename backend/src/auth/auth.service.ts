import { Injectable } from "@nestjs/common";
import { UsersService } from "src/users/users.service";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService
  ) { }

  async logout(userId: number) {
    await this.usersService.update(userId, { refreshToken: null })
  }
}