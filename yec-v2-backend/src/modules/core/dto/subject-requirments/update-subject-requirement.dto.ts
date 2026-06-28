import { PartialType } from '@nestjs/mapped-types';
import { CreateSubjectDto } from '@core/dto';

export class UpdateSubjectRequirementDto extends PartialType(CreateSubjectDto) {}
