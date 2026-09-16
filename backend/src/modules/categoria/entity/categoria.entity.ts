//id nombre descripcion activo
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity ('categoria')

export class Categoria{
   
    @PrimaryGeneratedColumn()
    idCategoria!: number;

    @Column({type: String, nullable: false, length: 10})
    name!: string;


    @Column({type: String, nullable: false, default: false})
    activo?: boolean;


}