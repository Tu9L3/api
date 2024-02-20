import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auth } from './entities/auth.entity';
import { JwtModule } from '@nestjs/jwt';
import { Profile } from 'src/profile/entities/profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Auth,Profile]), JwtModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
