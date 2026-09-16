import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Pago } from './entity/pago.entity';
import { PagoDto } from './dto/pago.dto';
import { Repository, UpdateResult } from 'typeorm';

@Injectable()
export class PagoService {
  constructor( @InjectRepository(Pago) private pagoRepository: Repository<Pago>,) {}

  async createPago(pago: PagoDto) {
    return await this.pagoRepository.save(pago);
}

  async findPago(idPago: number) {
    return await this.pagoRepository.findOne({where: { idPago } });
  }

  async findAll() {
    return await this.pagoRepository.find({where: { eliminado: false }});
  }

  async findAllDeleted() {
    return await this.pagoRepository.find({where: { eliminado: true }});
  }

  async updatePago(pago: PagoDto) {
    return await this.pagoRepository.save(pago);
  }

  async deletedPago(idPago: number) {
    const pagoExist = await this.findPago(idPago);

    if (!pagoExist) {
      throw new ConflictException(
        'El pago con ID ' + idPago + ' no existe',
      );
    }

    if (pagoExist.eliminado) {
      throw new ConflictException(
        'El pago con ID ' + idPago + ' ya fue eliminado',
      );
    }

    const rows: UpdateResult = await this.pagoRepository.update(
      { idPago },
      { eliminado: true },
    );

    return rows.affected == 1;
  }

  async restorePago(idPago: number) {
    const pagoExist = await this.findPago(idPago);

    if (!pagoExist) {
      throw new ConflictException(
        'El pago con ID ' + idPago + ' no existe',
      );
    }

    if (!pagoExist.eliminado) {
      throw new ConflictException(
        'El pago con ID ' + idPago + ' no está eliminado',
      );
    }

    const rows: UpdateResult = await this.pagoRepository.update(
      { idPago },
      { eliminado: false },
    );

    return rows.affected == 1;
  }
}