import { Module } from '@nestjs/common';
import { QuestionService } from './question.service';
import { QuestionController } from './question.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from './entities/question.entity';
import { Category } from 'src/category/entities/category.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Question,Category])],
  controllers: [QuestionController],
  providers: [QuestionService],
})
export class QuestionModule {}
