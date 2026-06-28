import { PartialType } from '@nestjs/swagger';
import {CreateOriginAddressDto} from "@core/dto";

export class UpdateOriginAddressDto extends PartialType(CreateOriginAddressDto) {}
