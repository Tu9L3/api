import { Photo } from 'src/photo/entities/photo.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @OneToMany(() => Photo, photo=>photo.user)
  photos: Photo[];
}
