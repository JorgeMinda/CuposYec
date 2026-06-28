import {
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Res
} from '@nestjs/common';
import {ApiTags, ApiOperation} from '@nestjs/swagger';
import {ResponseHttpModel} from '@shared/models';
import { CareerReportsService } from '../services/career-reports.service';


@ApiTags('Career Reports')
@Controller('career-reports')
export class CareerReportsController {
    constructor(private careerReportsService: CareerReportsService) {
    }

    @ApiOperation({summary: 'Career Report'})
    @Get('careers')
    @HttpCode(HttpStatus.OK)
    async catalogue(@Res() res: Response): Promise<ResponseHttpModel> {
        await this.careerReportsService.generateCareers(res);

        return {
            data: null,
            message: `Career Report`,
            title: `Report`,
        };
    }
}
