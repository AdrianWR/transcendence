import { AuthGuard } from '@nestjs/passport';

export class JwtTwoFactorGuard extends AuthGuard('two-factor') {}
