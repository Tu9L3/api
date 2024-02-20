import { User } from 'src/user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity()
export class Photo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  url: string;

  @ManyToOne(() => User, (user) => user.photos, { onDelete: 'CASCADE' })
  user: User;
}
