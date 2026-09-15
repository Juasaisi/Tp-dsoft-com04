import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("materiales")

export class Material {

  @PrimaryGeneratedColumn()
  idsale_d!:number;

 @Column({type:Number, nullable:false, length:30})
 cantidad!:number;
 
  @Column({type:Number, nullable:false, length:150})
  preciounitario!:number;

  @Column({type:Number, nullable:false, default:false})
  subtotal!: number;

  

}