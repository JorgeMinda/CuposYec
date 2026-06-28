import {Inject, Injectable} from '@nestjs/common';
import {Repository} from 'typeorm';
import {SubjectEntity, EnrollmentDetailEntity} from '@core/entities';
import {CoreRepositoryEnum} from '@shared/enums';
import {join} from 'path';
import * as XLSX from 'xlsx';
import * as fs from 'fs';

@Injectable()
export class EnrollmentSubjectsService {
    private row = 1;

    constructor(
        @Inject(CoreRepositoryEnum.ENROLLMENT_DETAIL_REPOSITORY) private readonly enrollmentDetailRepository: Repository<EnrollmentDetailEntity>,
        @Inject(CoreRepositoryEnum.SUBJECT_REPOSITORY) private readonly subjectRepository: Repository<SubjectEntity>,
    ) {
    }

    async import(file: Express.Multer.File) {
        this.row = 1;

        const path = join(process.cwd(), 'storage/imports', file.filename);

        const workbook = XLSX.readFile(path);
        const workbookSheets = workbook.SheetNames;
        const sheet = workbookSheets[0];
        const dataExcel = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);

        for (const item of dataExcel) {
            this.row++;
            const enrollmentDetail = await this.enrollmentDetailRepository.findOneBy({id: item['enrollment_detail_id']});

            const subject = await this.subjectRepository.findOne({
                where: {
                    name: item['subject_name'],
                    curriculumId: item['curriculum_id'],
                }
            });

            if (subject) {
                enrollmentDetail.subjectId = subject.id;

                await this.enrollmentDetailRepository.update(enrollmentDetail.id, enrollmentDetail);
            }else{
                console.log(this.row);
                console.log(item['subject_name']);
                console.log('----------------------------------------');
            }
            // fs.unlinkSync(join(process.cwd(), 'storage/imports', file.filename));
        }
    }
}
