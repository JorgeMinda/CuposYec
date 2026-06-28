import {Controller, Get, Res} from '@nestjs/common';
import {PrinterService} from "../services/printer.service";
import {Response} from 'express';

@Controller('pdfmake')
export class PdfmakeController {
    constructor(private readonly pdfMakeService: PrinterService) {
    }

    @Get()
    async generatePDF(@Res() response: Response) {
        const pdfDoc = await this.pdfMakeService.getReport();

        response.setHeader('Content-Type', 'application/pdf');
        pdfDoc.info.Title = 'Factura';
        pdfDoc.pipe(response);
        pdfDoc.end();

        return {};
    }
}
