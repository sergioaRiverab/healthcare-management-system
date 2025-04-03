import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from './jwt-payload.interface';

const cookieExtractor = (req: Request): string | null => {
  const jwt = req && req.cookies ? req.cookies['jwt'] : null; // Ensure the JWT is extracted from cookies
  console.log('Extracted JWT from cookies:', jwt); // Log the extracted JWT for debugging
  return jwt;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    const jwtSecret = configService.get<string>('JWT_SECRET');
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined in the configuration');
    }
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: JwtPayload): Promise<JwtPayload> {
    console.log('JWT Payload:', payload); // Log the payload for debugging
    if (!payload) {
      console.error('Invalid JWT Payload'); // Log invalid payload
      throw new UnauthorizedException();
    }
    return payload;
  }
}
