import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("detalle venta")

export class Sale_details {

  @PrimaryGeneratedColumn()
  idsale_d!:number;

 @Column({type:Number, nullable:false})
 cantidad!:number;
 
  @Column({type:Number, nullable:false})
  preciounitario!:number;

  @Column({type:Number, nullable:false})
  subtotal!: number;


}