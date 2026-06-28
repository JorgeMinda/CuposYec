import {
    Controller,
    Get,
    Res,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SecretaryService } from '@core/services';

@ApiTags('Secretary')
@Controller('secretary')

export class SecretaryController {
    constructor(private secretaryService: SecretaryService) { }

}
