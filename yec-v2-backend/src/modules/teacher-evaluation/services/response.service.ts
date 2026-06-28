import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ResponseEntity } from '../entities/response.entity';
import { CreateResponseDto } from '../dto/response/create-response.dto';
import { UpdateResponseDto } from '../dto/response/update-response.dto';
import { FilterResponseDto } from '../dto/response/filter-response.dto';
import { CoreRepositoryEnum, TeacherEvaluationRepositoryEnum } from '@shared/enums';

@Injectable()
export class ResponseService {
  constructor(
    @Inject(TeacherEvaluationRepositoryEnum.RESPONSE_REPOSITORY)
    private readonly responseRepository: Repository<ResponseEntity>,
  ) {}

  async create(createResponseDto: CreateResponseDto): Promise<ResponseEntity> {
    const response = this.responseRepository.create(createResponseDto);
    return await this.responseRepository.save(response);
  }

  async findAll(filter: FilterResponseDto): Promise<{ data: ResponseEntity[]; count: number }> {
    const [data, count] = await this.responseRepository.findAndCount({
      where: filter,
    });
    return { data, count };
  }

  async findOne(id: string): Promise<ResponseEntity> {
    const response = await this.responseRepository.findOne({ where: { id } });
    if (!response) {
      throw new NotFoundException('Response not found');
    }
    return response;
  }

  async update(id: string, updateResponseDto: UpdateResponseDto): Promise<ResponseEntity> {
    await this.responseRepository.update(id, updateResponseDto);
    const updatedResponse = await this.responseRepository.findOne({ where: { id } });
    if (!updatedResponse) {
      throw new NotFoundException('Response not found');
    }
    return updatedResponse;
  }

  async remove(id: string): Promise<void> {
    const response = await this.responseRepository.findOne({ where: { id } });
    if (!response) {
      throw new NotFoundException('Response not found');
    }
    await this.responseRepository.softRemove(response);
  }

  async removeAll(ids: string[]): Promise<void> {
    const responses = await this.responseRepository.findByIds(ids);
    if (responses.length === 0) {
      throw new NotFoundException('Responses not found');
    }
    await this.responseRepository.softRemove(responses);
  }
}
