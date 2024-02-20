import { Profile } from 'src/profile/entities/profile.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

enum ROLE {
  Admin = 'admin',
  User = 'user',
}

@Entity()
export class Auth {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({
    nullable: true,
  })
  refreshToken: string;

  @Column({ nullable: true })
  image: string;

  @Column({
    type: 'enum',
    enum: ROLE,
    default: ROLE.User,
  })
  role: ROLE;

  @OneToOne(() => Profile, { onDelete: 'CASCADE' })
  @JoinColumn()
  profile: Profile;
}
