import { CatalogueDto } from '@core/dto';
import {IsBoolean} from "class-validator";
import {isBooleanValidationOptions} from "@shared/validation";

export class SeedCatalogueDto extends CatalogueDto {
    @IsBoolean(isBooleanValidationOptions())
    readonly required: boolean;
}