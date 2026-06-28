import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { config } from '@config';
import { ConfigType } from '@nestjs/config';
import { PayloadTokenModel } from '@auth/models';
import { UserEntity } from '@auth/entities';
import { UsersService } from '../services/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {

  constructor(
    private userService: UsersService,
    @Inject(config.KEY) configService: ConfigType<typeof config>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.jwtSecret,
    });
  }

  async validate(payload: PayloadTokenModel): Promise<UserEntity> {
    const user = await this.userService.findOne(payload.id);

    if (!user) throw new UnauthorizedException('El Usuario no existe.');

    if (user.suspendedAt) throw new UnauthorizedException('El usuario está suspendido.');

    if (user.maxAttempts === 0) throw new UnauthorizedException('Ha excedido el número máximo de intentos permitidos');

    return user;
  }
}
