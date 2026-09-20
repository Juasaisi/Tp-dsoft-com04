import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Cliente } from "../../cliente/entity/cliente.entity";

@Entity("ventas")
export class Venta {

    @PrimaryGeneratedColumn()
    idventa!: number;

    @ManyToOne(() => Cliente, (cliente) => cliente.ventas, {
    nullable: false,
    })
    @JoinColumn({ name: 'idCliente' })
    cliente!: Cliente;


    @Column({type: 'date', nullable:false })
    fecha!: string;

    @Column({type:Number, nullable:false})
    total!: number;

    @Column({type:Boolean, nullable:false, default:false})
    delete?: boolean;
}