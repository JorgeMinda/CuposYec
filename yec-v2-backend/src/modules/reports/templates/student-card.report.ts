import { Content, TDocumentDefinitions } from 'pdfmake/interfaces';
import { StudentEntity } from '@core/entities';

const avatar: Content = {
  image: './assets/avatars/unisex.png',
  width: 210,
  height: 210,
  absolutePosition: { x: 165, y: 178 },
};

export const studentCardReport = (configService: any, student: StudentEntity): TDocumentDefinitions => {
  const schoolPeriod = student.enrollments[0].schoolPeriod.shortName;
  const identification = student.user.identification;
  const names = student.user.name;
  const lastName = student.user.lastname;
  const career = student.enrollments[0].career.name;
  const studentId = student.id;
  const careerId = student.enrollments[0].careerId;
  const schoolPeriodId = student.enrollments[0].schoolPeriodId;

  const qr = `${configService.appUrl}/document-validations/student-card/${studentId}?careerId=${careerId}&schoolPeriodId=${schoolPeriodId}&currentTime=${new Date().getTime()}`;

  if (student.user.avatar) {
    avatar.image = `./assets/${student.user.avatar}`;
  } else {
    if (student.user.sex.code === '1') {
      avatar.image = `./assets/avatars/man.png`;
    } else if (student.user.sex.code === '2') {
      avatar.image = `./assets/avatars/woman.png`;
    }
  }

  return {
    pageSize: {
      width: 540,
      height: 960,
    },
    pageMargins: [0, 0, 0, 0],
    background: [
      {
        image: './resources/images/reports/student-card.png',
        width: 540,
        height: 960,
        absolutePosition: { x: 0, y: 0 },
        opacity: 1,
      },
    ],
    content: [
      avatar,
      {
        text: schoolPeriod,
        fontSize: 20,
        color: '#0082CB',
        absolutePosition: { x: 0, y: 140 },
        alignment: 'center',
      },
      {
        text: identification,
        fontSize: 30,
        color: '#0082CB',
        absolutePosition: { x: 0, y: 450 },
        alignment: 'center',
      },
      {
        text: names,
        fontSize: 30,
        color: '#0082CB',
        bold: true,
        absolutePosition: { x: 0, y: 500 },
        alignment: 'center',
      },
      {
        text: lastName,
        fontSize: 30,
        color: '#0082CB',
        bold: true,
        absolutePosition: { x: 0, y: 550 },
        alignment: 'center',
      },
      {
        text: 'CARRERA',
        fontSize: 18,
        color: '#0082CB',
        absolutePosition: { x: 10, y: 610 },
        alignment: 'center',
      },
      {
        text: career,
        fontSize: 18,
        color: '#0082CB',
        absolutePosition: { x: 10, y: 635 },
        alignment: 'center',
      },
      {
        qr,
        fit: 158,
        foreground: '#0082CB',
        absolutePosition: { x: 370, y: 700 },
      },
    ],
  };
};
