import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"
import { Nota } from './Nota'

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @OneToMany(() => Nota, (nota) => nota.user)
    notes: Nota[]
}