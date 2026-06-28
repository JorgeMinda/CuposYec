import {
  ForbiddenException,
  Inject,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { PayloadTokenModel } from '@auth/models';
import { config } from '@config';
import { ConfigType } from '@nestjs/config';
import { UsersService } from '../modules/auth/services/users.service';
import { Repository } from 'typeorm';
import { AuthRepositoryEnum } from '@shared/enums';
import { UserEntity } from '@auth/entities';

@Injectable()
export class VerifyUserMiddleware implements NestMiddleware {
  constructor(
    @Inject(AuthRepositoryEnum.USER_REPOSITORY) private readonly userEntityRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ) {

  }

  async use(req: Request, res: Response, next: NextFunction) {
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(' ');
      const jwtDecode = this.jwtService.decode(token[1]) as PayloadTokenModel;
      const user = await this.userEntityRepository.findOneBy({ id: jwtDecode.id });

      if (user.suspendedAt) {
        throw new ForbiddenException({
          error: 'Cuenta Suspendida',
          message: 'La cuenta del usuario está suspendida',
        });
      }
    }

    next();
  }

}
