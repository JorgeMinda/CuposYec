import {Inject, Injectable} from '@nestjs/common';
import {PrinterService} from "./printer.service";
import {ConfigType} from '@nestjs/config';
import {config} from '@config';
import {TeacherEvaluationSqlService} from "./teacher-evaluation-sql.service";
import {integralEvaluationReport} from "../templates/integral-evaluation.report";
// import {integralEvaluationReport} from "../templates/integral-evaluation.report";

@Injectable()
export class TeacherEvaluationReportsService {

    constructor(
        private readonly teacherEvaluationSqlService: TeacherEvaluationSqlService,
        private readonly printerService: PrinterService,
        @Inject(config.KEY) private configService: ConfigType<typeof config>,
    ) {
    }

    async generateIntegralEvaluation(evaluatedId: string, schoolPeriodId: string) {
        const data = await this.teacherEvaluationSqlService.findIntegralEvaluation(evaluatedId, schoolPeriodId);
        try {
            return this.printerService.createPdf(integralEvaluationReport(data));
        } catch (error) {
            throw new Error;
        }
    }
}
