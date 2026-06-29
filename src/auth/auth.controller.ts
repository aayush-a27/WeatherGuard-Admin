import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { UserDocument } from '../users/schemas/user.schema';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  // ─── Google OAuth ─────────────────────────────────────

  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Initiate Google OAuth login' })
  @ApiResponse({ status: 302, description: 'Redirects to Google consent screen' })
  googleLogin(): void {
    // Guard redirects to Google
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Google OAuth callback' })
  @ApiResponse({ status: 302, description: 'Redirects to frontend with JWT token' })
  googleCallback(@Req() req: Request, @Res() res: Response): void {
    const user = req.user as UserDocument;
    const token = this.authService.generateJwt(user);
    const frontendUrl = this.configService.get<string>('frontendUrl');

    res.redirect(`${frontendUrl}/login?token=${token}`);
  }

  // ─── GitHub OAuth ─────────────────────────────────────

  @Get('github')
  @UseGuards(AuthGuard('github'))
  @ApiOperation({ summary: 'Initiate GitHub OAuth login' })
  @ApiResponse({ status: 302, description: 'Redirects to GitHub authorization page' })
  githubLogin(): void {
    // Guard redirects to GitHub
  }

  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  @ApiOperation({ summary: 'GitHub OAuth callback' })
  @ApiResponse({ status: 302, description: 'Redirects to frontend with JWT token' })
  githubCallback(@Req() req: Request, @Res() res: Response): void {
    const user = req.user as UserDocument;
    const token = this.authService.generateJwt(user);
    const frontendUrl = this.configService.get<string>('frontendUrl');

    res.redirect(`${frontendUrl}/login?token=${token}`);
  }
}
