import { Controller, Get } from '@nestjs/common';

@Controller('user')
export class UserController {
  @Get()
  create(): string {
    return 'Hello from Back-end';
  }

}
