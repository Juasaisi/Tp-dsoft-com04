import { Column, Entity, PrimaryGeneratedColumn, } from 'typeorm' ;

@Entity("pago")


export class Pago {


@PrimaryGeneratedColumn()
idPago!:number;

@Column({type:Date, nullable:false})
fecha!:Date;

@Column({type:Number, nullable:false, length:10})
importe!:number;

@Column({type:String, nullable:false, unique: true, length:50})
medioPago!:string;

@Column({type:Boolean, default:false})
eliminado!:boolean;

}





 
 