import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { ChatGateway } from './chat.gateway';
import { chatProviders } from './chat.providers';
import { ChatService } from './chat.service';

@Module({
  imports: [DatabaseModule],
  providers: [
    ...chatProviders,
    ChatGateway,
    ChatService
  ],
})

export class ChatModule { }
