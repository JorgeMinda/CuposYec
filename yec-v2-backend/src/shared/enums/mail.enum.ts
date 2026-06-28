import {join} from "path";

export enum MailEnum {
  PG_DATA_SOURCE = 'PG_DATA_SOURCE',
}

export enum MailSubjectEnum {
  RESET_PASSWORD = 'Solicitud de Restablecimiento de Contraseña',
}

export enum MailTemplateEnum {
  TEST = 'test',
  TRANSACTIONAL_CODE = 'auth/transactional-code',
}
