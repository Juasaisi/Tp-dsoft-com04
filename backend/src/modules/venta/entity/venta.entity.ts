import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("ventas")
export class Venta {

    @PrimaryGeneratedColumn()
    idventa!: number;

    @Column({type:Number, nullable:false})
    idcliente!: number;

    @Column({type:String, nullable:false, length:10})
    fecha!: string;

    @Column({type:Number, nullable:false})
    total!: number;

    @Column({type:Boolean, nullable:false, default:false})
    delete?: boolean;
}