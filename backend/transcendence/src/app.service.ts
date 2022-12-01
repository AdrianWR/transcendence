import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
  user_signup(body): string {
    console.log(body);
	return 'User Signup';
  }
}
