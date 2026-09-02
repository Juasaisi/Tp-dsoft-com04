import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity ('cliente')

export class Cliente{
   
    @PrimaryGeneratedColumn()
    idCliente!: number;
    
    @Column({type: String, nullable: false, length: 8})
    dni!: string;

    @Column({type: String, nullable: false, length: 10})
    name!: string;
    
    @Column({type: String, nullable: false, length: 10})
    surname!: string;

    @Column({type: String, nullable: false, length: 10})
    phone!: string;

    @Column({type: String, nullable: false, length: 30})
    email!: string;

    @Column({type: String, nullable: false, default: false})
    delete?: boolean;


}