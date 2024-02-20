import { Module } from '@nestjs/common';
import { PhotoService } from './photo.service';
import { PhotoController } from './photo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Photo } from './entities/photo.entity';

@Module({
  imports:[TypeOrmModule.forFeature([User,Photo])],
  controllers: [PhotoController],
  providers: [PhotoService],
})
export class PhotoModule {}
