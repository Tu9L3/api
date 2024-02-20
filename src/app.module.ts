import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auth } from './auth/entities/auth.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProfileModule } from './profile/profile.module';
import { Profile } from './profile/entities/profile.entity';
import { PhotoModule } from './photo/photo.module';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { Photo } from './photo/entities/photo.entity';
import { CategoryModule } from './category/category.module';
import { QuestionModule } from './question/question.module';
import { Category } from './category/entities/category.entity';
import { Question } from './question/entities/question.entity';
import { UploadModule } from './upload/upload.module';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Request } from 'express';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [Auth, Profile, User, Photo, Category, Question],
        synchronize: true,
        autoLoadEntities: true,
      }),
    }),
    MulterModule.register({
      dest: './uploads',
      storage: diskStorage({
        destination: (req: Request, file, cb) => {
          cb(null, './uploads');
        },
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${Date.now()}${file.originalname}`);
        },
      }),
    }),
    AuthModule,
    ProfileModule,
    PhotoModule,
    UserModule,
    CategoryModule,
    QuestionModule,
    UploadModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
