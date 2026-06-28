import {Inject, Injectable, Res} from '@nestjs/common';
import {Repository} from 'typeorm';
import {CareerEntity} from '@core/entities';
import {CoreRepositoryEnum} from '@shared/enums';

const {PDFDocument} = require("pdfkit-table-ts");
const blobStream = require('blob-stream');

@Injectable()
export class CareerReportsService {
    constructor(
        @Inject(CoreRepositoryEnum.CAREER_REPOSITORY)
        private repository: Repository<CareerEntity>,
    ) {
    }

    async generateCareers(@Res() res: Response) {
        const doc = new PDFDocument()
        doc.pipe(res);

        doc.text('hello world', 100, 50);

        const careers = await this.findCareers();
        const headers = ['Código', 'Carrera'];

        const rows = [];

        for (const item of careers) {
            const row = [item.code, item.name];
            rows.push(row);
        }

        await doc.table({headers, rows});

        doc.end();
    }

    private async findCareers(): Promise<CareerEntity[]> {
        const data = await this.repository.find({
            relations: {institution: true}
        });

        return data;
    }
}
