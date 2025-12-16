import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Produto } from '../entities/produto.entity';

@Injectable()
export class ProdutoService {
  constructor(
    @InjectRepository(Produto)
    private produtoRepository: Repository<Produto>,
  ) {}

  async findAll(): Promise<Produto[]> {
    return await this.produtoRepository.find();
  }

  async findById(id: number): Promise<Produto> {
    let produto = await this.produtoRepository.findOne({
      where: { id },
    });

    if (!produto)
      throw new HttpException('Produto não encontrada!', HttpStatus.NOT_FOUND);

    return produto;
  }

  async findByProductName(nome_produto: string): Promise<Produto[]> {
    return await this.produtoRepository.find({
      where: {
        nome_produto: ILike(`%${nome_produto}`),
      },
    });
  }

  async create(produto: Produto): Promise<Produto> {
    return await this.produtoRepository.save(produto);
  }

  async update(produto: Produto): Promise<Produto> {
    await this.findById(produto.id);
    return await this.produtoRepository.save(produto);
  }

    async delete(id: number): Promise<void> {
    const item = await this.findById(id);
    if (!item) {
      throw new HttpException('Produto não encontrada!', HttpStatus.NOT_FOUND);
    }
    await this.produtoRepository.delete(id);
  }

}
