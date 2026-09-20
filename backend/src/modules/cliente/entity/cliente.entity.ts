import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Venta } from "../../venta/entity/venta.entity";

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


    @Column({type: 'boolean', nullable: false, default: false})
    delete!: boolean;

    @OneToMany(() => Venta, (venta) => venta.cliente)
  ventas!: Venta[];




}