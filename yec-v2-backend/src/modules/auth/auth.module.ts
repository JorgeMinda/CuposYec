import { Global, Module } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard, PassportModule } from '@nestjs/passport';
import { config } from '@config';
import { AuthController, RolesController, UsersController } from '@auth/controllers';
import { AuditsService, AuthService, MenusService, RolesService } from '@auth/services';
import { authProviders } from '@auth/providers';
import { DatabaseModule } from '@database';
import { MenusController } from './controllers/menus.controller';
import { CommonModule } from '@common/modules';
import { CoreModule } from '@core/modules';
import { UsersService } from './services/users.service';
import { JwtStrategy } from '@auth/strategies';
import { APP_GUARD } from '@nestjs/core';
import { JwtGuard } from '@auth/guards';

@Global()
@Module({
  imports: [
    DatabaseModule,
    CommonModule,
    CoreModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      inject: [config.KEY],
      useFactory: (configService: ConfigType<typeof config>) => {
        return {
          secret: configService.jwtSecret,
          signOptions: {
            expiresIn: '24h',
          },
        };
      },
    }),
  ],
  controllers: [AuthController, MenusController, RolesController, UsersController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
    ...authProviders,
    AuditsService,
    AuthService,
    RolesService,
    UsersService,
    MenusService,
    JwtStrategy,
  ],
  exports: [
    ...authProviders,
    UsersService,
    RolesService,
    MenusService,
    AuditsService,
    JwtModule,
    PassportModule,
  ],
})
export class AuthModule {
}
