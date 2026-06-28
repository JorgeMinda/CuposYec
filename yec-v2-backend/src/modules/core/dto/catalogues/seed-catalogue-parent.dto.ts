import { CatalogueDto } from '@core/dto';
import {IsBoolean, IsUUID} from "class-validator";
import {isBooleanValidationOptions} from "@shared/validation";

export class SeedCatalogueParentDto extends CatalogueDto {
    @IsUUID()
    readonly parentId: string;
}
