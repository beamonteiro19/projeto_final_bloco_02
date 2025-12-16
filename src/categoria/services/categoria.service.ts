import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Categoria } from '../entities/categoria.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoriaService {
  constructor(
    @InjectRepository(Categoria)
    private categoriaRepository: Repository<Categoria>,
  ) {}

  async findAll(): Promise<Categoria[]> {
    return await this.categoriaRepository.find({
      relations: ['produtos'],
    });
  }

  async findById(id: number): Promise<Categoria> {
    let categoria = await this.categoriaRepository.findOne({
      where: { id },
      relations: ['produtos'],
    });

    if (!categoria)
      throw new HttpException(
        'Categoria não encontrada!',
        HttpStatus.NOT_FOUND,
      );

    return categoria;
  }

  async findByType(categoria: string): Promise<Categoria[]> {
    return await this.categoriaRepository.find({
      where: { tipo: categoria },
    });
  }

  async relatorioCategorias(): Promise<any[]> {
  const categorias = await this.categoriaRepository.find({
    relations: ['produtos'],
  });

  return categorias.map((categoria) => ({
    id: categoria.id,
    tipo: categoria.tipo,
    restricao: categoria.restricao,
    quantidade_produtos: categoria.produtos.length,
  }));
}

  async create(categoria: Categoria): Promise<Categoria> {
    return await this.categoriaRepository.save(categoria);
  }

  async update(categoria: Categoria): Promise<Categoria> {
    await this.findById(categoria.id);
    return await this.categoriaRepository.save(categoria);
  }

  async delete(id: number): Promise<void> {
    const item = await this.findById(id);
    if (!item) {
      throw new HttpException(
        'Categoria não encontrada!',
        HttpStatus.NOT_FOUND,
      );
    }
    await this.categoriaRepository.delete(id);
  }
}
