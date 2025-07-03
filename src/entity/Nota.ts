import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm"
import { User } from "./User"

@Entity()
export class Nota {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    content: string; 

    @OneToOne(() => User, (user) => user.nota)
    @JoinColumn()
    user: User
}   