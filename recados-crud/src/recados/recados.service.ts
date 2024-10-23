import { Injectable } from '@nestjs/common';
import { RecadoNotFoundException } from './exceptions';
import { Recado } from './entities/recado.entity';
import { UpdateRecadoDto } from './dto/update-recado.dto';
import { RecadoDto } from './dto/recado.dto';
import { CreateRecadoDto } from './dto/create-recado.dto';

@Injectable()
export class RecadosService {
  private readonly recados: Recado[] = new Array(50)
    .fill('')
    .map((_, index) => ({
      id: index + 1,
      to: `de ${index}`,
      from: `de ${index}`,
      createdAt: new Date(),
      read: false,
      text: `Ola mundo ${index + 1}!!`,
    }));

  createOne(dto: CreateRecadoDto): RecadoDto {
    const recado = {
      id: this.recados.length,
      to: dto.to,
      from: dto.to,
      createdAt: new Date(),
      read: false,
      text: dto.text,
    };
    this.recados.push(recado);
    return recado;
  }

  deleteOne(id: number) {
    const index = this.recados.findIndex((recado) => recado.id === id);
    if (index === -1) {
      throw new RecadoNotFoundException('Recado não encontrado.');
    }
    this.recados.splice(index, 1);
  }

  findOne(id: number) {
    const recado = this.recados.find((recado) => recado.id === id);
    if (!recado) {
      throw new RecadoNotFoundException('Recado não encontrado.');
    }
    return recado;
  }

  findAll(page: number, size: number, q: string) {
    const start = (page - 1) * size;
    const end = start + size;
    let recados = [...this.recados];
    if (typeof q === 'string' && q.length > 0) {
      recados = recados.filter(
        (recado) =>
          recado.text.toLocaleLowerCase().includes(q.toLocaleLowerCase()) ||
          recado.to.toLocaleLowerCase().includes(q.toLocaleLowerCase()) ||
          recado.from.toLocaleLowerCase().includes(q.toLocaleLowerCase()),
      );
    }
    recados = recados.slice(start, end);
    return {
      recados,
      totaItems: this.recados.length,
      totalPages: Math.ceil(this.recados.length / size),
    };
  }

  updateOne(id: number, dto: UpdateRecadoDto) {
    const index = this.recados.findIndex((recado) => recado.id === id);
    if (index === -1) {
      throw new RecadoNotFoundException('Recado não encontrado.');
    }
    if(dto.to) {
      this.recados[index].to = dto.to;
    }
    if(dto.from) {
      this.recados[index].from = dto.from;
    }
    if(dto.text) {
      this.recados[index].text = dto.text;
    }
    if(dto.read) {
      this.recados[index].read = dto.read;
    }
  }
}
