import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm"
import { User } from "./User"

@Entity()
export class Nota {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    content: string; 

    @ManyToOne(() => User, (user) => user.notes)
    @JoinColumn()
    user: User
}   