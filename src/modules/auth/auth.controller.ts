import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@src/prisma/prisma.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService
  ) {}

  @Post('signup')
  async signup(
    @Body() body: { email: string; name: string; password: string }
  ) {
    const result = await this.authService.signup(
      body.email,
      body.name,
      body.password
    );
    return {
      message: '일반 회원가입 성공',
      user: result,
    };
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const result = await this.authService.login(body.email, body.password);
    return {
      message: '일반 로그인 성공',
      user: result.user,
      accessToken: result.accessToken,
    };
  }
}
