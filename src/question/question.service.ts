import { Injectable } from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Question } from './entities/question.entity';
import { Repository } from 'typeorm';
import { Category } from 'src/category/entities/category.entity';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}
  async create(createQuestionDto: CreateQuestionDto) {
    const category = await this.categoryRepository.findOne({
      where: {
        id: '127599b9-0edc-4f9d-a0b2-6bead4716f38',
      },
    });

    const cate = this.questionRepository.create({
      text: 'dsffasdsfddf1',
      title: 'sfdsafddfs1',
      categories: [category],
    });

    this.questionRepository.save(cate);
  }

  findAll() {
    return `This action returns all question`;
  }

  findOne(id: number) {
    return `This action returns a #${id} question`;
  }

  update(id: number, updateQuestionDto: UpdateQuestionDto) {
    return `This action updates a #${id} question`;
  }

  remove(id: number) {
    return `This action removes a #${id} question`;
  }
}
