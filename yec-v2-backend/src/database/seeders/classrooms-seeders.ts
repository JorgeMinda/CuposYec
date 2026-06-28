import { Injectable } from '@nestjs/common';
import { SeedClassroomDto } from '@core/dto';
import { CataloguesService, ClassroomsService } from '@core/services';
import { CatalogueEntity } from '@core/entities';
import { faker } from '@faker-js/faker';
import { CatalogueTypeEnum } from '@shared/enums';

@Injectable()
export class ClassroomSeeder {
  private states: CatalogueEntity[] = [];
  private types: CatalogueEntity[] = [];

  constructor(private classroomsService: ClassroomsService, private catalogueService: CataloguesService) {}

  async run() {
    await this.loadCatalogues();
    await this.create();
  }

  private async create() {
    const classrooms: SeedClassroomDto[] = [];

    for (let i = 1; i <= 20; i++) {
      classrooms.push({
        capacity: 50,
        code: 'cod' + i,
        name: 'Aula ' + i,
        location: 'Piso ' + faker.helpers.rangeToNumber({ min: 1, max: 5 }),
        state: this.states[faker.helpers.rangeToNumber({ min: 0, max: this.states.length - 1 })],
        type: this.types[faker.helpers.rangeToNumber({ min: 0, max: this.types.length - 1 })],
      });
    }

    for (const item of classrooms) {
      await this.classroomsService.create(item);
    }
  }

  private async loadCatalogues() {
    const catalogues = (await this.catalogueService.findAll()).data as CatalogueEntity[];

    this.states = catalogues.filter(catalogue => catalogue.type === CatalogueTypeEnum.CLASSROOMS_STATE);

    this.types = catalogues.filter(catalogue => catalogue.type === CatalogueTypeEnum.CLASSROOMS_TYPE);
  }
}
