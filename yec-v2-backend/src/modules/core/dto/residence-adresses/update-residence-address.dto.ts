import { PartialType } from '@nestjs/swagger';
import {CreateResidenceAddressDto} from "@core/dto";

export class UpdateResidenceAddressDto extends PartialType(CreateResidenceAddressDto) {}
