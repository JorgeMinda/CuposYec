import { Injectable } from '@nestjs/common';
import { SeedPartialDto } from '@core/dto';
import { PartialsService } from '@core/services';

@Injectable()
export class PartialsSeeder {
  constructor(private partialsService: PartialsService) {}

  async run() {
    await this.create();
  }

  private async create() {
    const partials: SeedPartialDto[] = [];

    partials.push(
      {
        code: '1',
        name: 'Parcial 1',
      },
      {
        code: '2',
        name: 'Parcial 2',
      },
    );

    for (const item of partials) {
      await this.partialsService.create(item);
    }
  }
}
