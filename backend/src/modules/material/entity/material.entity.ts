import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("materiales")

export class Material {

  @PrimaryGeneratedColumn()
  idmaterial!:number;

 @Column({type:String, nullable:false, length:30})
 tipomaterial!:string;
 
  @Column({type:String, nullable:false, length:150})
  descripcion!:string;

  @Column({type:Boolean, nullable:false, default:false})
  stock!: boolean;

  @Column({type:Number, nullable:false})
  cantidad!:number;

  @Column({type:Boolean, nullable:false, default:false})
  delete?:boolean;



}