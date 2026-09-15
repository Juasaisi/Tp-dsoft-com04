@Entity("usuarios")


export class Usuario {


  @PrimaryGeneratedColumn()
  idusuario!:number;


 @Column({type:String, nullable:false, length:30})
 nombre!:string;
 
  @Column({type:String, nullable:false, length:30})
  email!:string;


 
  //contraseña??


  @Column({type:String, nullable:false, length:10})
  rol!:string;


}
