import { Category } from "src/category/entities/category.entity"
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToMany,
    JoinTable,
} from "typeorm"

@Entity()
export class Question {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    title: string

    @Column()
    text: string

    @ManyToMany(() => Category)
    @JoinTable()
    categories: Category[]
}