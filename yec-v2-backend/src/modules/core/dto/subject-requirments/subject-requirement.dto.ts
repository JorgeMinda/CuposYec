import { IsNotEmpty } from 'class-validator';
import { SubjectEntity } from '@core/entities';
import { CatalogueSubjectRequirementTypeEnum } from '@shared/enums';

export class SubjectRequirementDto {
  @IsNotEmpty()
  readonly subject: SubjectEntity;

  @IsNotEmpty()
  readonly requirement: SubjectEntity;

  @IsNotEmpty()
  readonly isEnabled: boolean;
}
