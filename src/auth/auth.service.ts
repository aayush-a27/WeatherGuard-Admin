import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService, OAuthProfile } from '../users/users.service';
import { UserDocument } from '../users/schemas/user.schema';
import { JwtPayload } from '../common/interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Validate and find-or-create a user from an OAuth profile.
   * Returns the user document.
   */
  async validateOAuthUser(profile: OAuthProfile): Promise<UserDocument> {
    const user = await this.usersService.findOrCreateFromOAuth(profile);
    this.logger.log(`OAuth user validated: ${user.email}`);
    return user;
  }

  /**
   * Generate a JWT token for the given user.
   */
  generateJwt(user: UserDocument): string {
    const payload: JwtPayload = {
      sub: (user as UserDocument & { _id: { toString(): string } })._id.toString(),
      email: user.email,
      role: user.role,
    };

    return this.jwtService.sign(payload);
  }
}
