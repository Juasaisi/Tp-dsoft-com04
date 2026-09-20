import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Productos } from "../../productos/entity/producto.entity";
import { Venta } from "../../venta/entity/venta.entity";

@Entity("detalle venta")

export class Sale_details {

  @PrimaryGeneratedColumn()
  idsale_d!:number;

 @Column({type:Number, nullable:false})
 cantidad!:number;
 
  @Column({type: 'decimal', nullable:false})
  preciounitario!:number;

  @Column({type:'decimal', nullable:false})
  subtotal!: number;

   @ManyToOne(() => Venta, (venta) => venta.detalles, {
    nullable: false,
  })
  @JoinColumn({ name: 'idventa' })
  venta!: Venta;

  @ManyToOne(
    () => Productos,
    (producto) => producto.detallesVenta,
    { nullable: false },
  )
  @JoinColumn({ name: 'idproducto' })
  producto!: Productos;
}


