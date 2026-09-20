import { Column, Entity, PrimaryGeneratedColumn, } from 'typeorm' ;

@Entity("pago")


export class Pago {


@PrimaryGeneratedColumn()
idPago!:number;

@Column({type:Date, nullable:false})
fecha!:Date;

@Column({type:Number, nullable:false })
importe!:number;

@Column({type:String, nullable:false, length:50})
medioPago!:string;

@Column({type:Boolean, default:false})
eliminado!:boolean;

}





 
 