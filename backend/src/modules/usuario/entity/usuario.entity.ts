import { Column, Entity, PrimaryGeneratedColumn, } from 'typeorm' ;

@Entity("usuarios")


export class Usuario {


  @PrimaryGeneratedColumn()
  idUsuario!:number;


 @Column({type:String, nullable:false, length:30})
 nombre!:string;
 
  @Column({type:String, nullable:false, unique: true, length:50})
  email!:string;

  @Column({type:String, nullable:false, length:255})
  passwordHash!:string; 
  // explicacion

  @Column({type:String, nullable:false, length:10})
  rol!:string;

  @Column({type:Boolean, default:false})
  eliminado!:boolean;


}
