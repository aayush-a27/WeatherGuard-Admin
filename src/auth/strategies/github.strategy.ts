import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-github2';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      clientID: configService.get<string>('github.clientId'),
      clientSecret: configService.get<string>('github.clientSecret'),
      callbackURL: configService.get<string>('github.callbackUrl'),
      scope: ['user:email'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    done: (error: Error | null, user?: any) => void,
  ): Promise<void> {
    const email =
      profile.emails?.[0]?.value ||
      `${profile.username}@github.placeholder`;

    const user = await this.authService.validateOAuthUser({
      name: profile.displayName || profile.username || email,
      email,
      provider: 'github',
      avatar: profile.photos?.[0]?.value,
    });

    done(null, user);
  }
}
