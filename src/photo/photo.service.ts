import { Injectable } from '@nestjs/common';
import { CreatePhotoDto } from './dto/create-photo.dto';
import { UpdatePhotoDto } from './dto/update-photo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Photo } from './entities/photo.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class PhotoService {
  constructor(
    @InjectRepository(Photo)
    private photoRepository: Repository<Photo>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  async create(createPhotoDto: CreatePhotoDto) {
    const user = await this.userRepository.findOne({
      where: {
        id: createPhotoDto.userId,
      },
    });

    const photo = await this.photoRepository.create({
      url: createPhotoDto.url,
      user: user,
    });

    await this.photoRepository.save(photo);

    return 'This action adds a new photo';
  }

  async findAll() {
    const all = await this.photoRepository.find({
      relations: {
        user: true,
      },
    });
    return all;
  }

  findOne(id: number) {
    return `This action returns a #${id} photo`;
  }

  update(id: number, updatePhotoDto: UpdatePhotoDto) {
    return `This action updates a #${id} photo`;
  }

  remove(id: number) {
    return `This action removes a #${id} photo`;
  }
}
