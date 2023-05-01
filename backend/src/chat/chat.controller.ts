import { Body, ClassSerializerInterceptor, Controller, Param, Post, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { JwtTwoFactorGuard } from '../auth/2fa/2fa.guard';
import { UpdateChatDto } from './dto/update-chat.dto';
import { RequestTypeWithUser } from '../auth/types/auth.interface';

@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtTwoFactorGuard)
@Controller('chats')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post(':friendId/block')
  async blockFriend(@Req() req: RequestTypeWithUser, @Param('friendId') friendId: number) {
    const { user } = req;
    return await this.chatService.blockUser(user.id, friendId);
  }

  @Post(':friendId/unblock')
  async unblockFriend(@Req() req: RequestTypeWithUser, @Param('friendId') friendId: number) {
    const { user } = req;
    return await this.chatService.unblockUser(user.id, friendId);
  }
}
