import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Cliente } from "../../cliente/entity/cliente.entity";
import { Sale_details } from "../../sale_details/entity/sale_details.entity";

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

    @OneToMany(
        () => Sale_details, 
        (detalle) => detalle.venta,
    )
    detalles!: Sale_details[];
}