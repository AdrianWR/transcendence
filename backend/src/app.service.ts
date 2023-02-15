import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AppService {
  private readonly logger: Logger = new Logger(AppService.name);

  getHello(): string {
    return 'Hello World!';
  }
}