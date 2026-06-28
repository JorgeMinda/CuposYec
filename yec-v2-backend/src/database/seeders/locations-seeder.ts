import { Injectable } from '@nestjs/common';
import { LocationsService } from '@core/services';
import * as XLSX from 'xlsx';
import { join } from 'path';

@Injectable()
export class LocationsSeeder {
  constructor(private locationsService: LocationsService) {}

  async run() {
    await this.importCountries();
    await this.importDPA();
  }

  async importCountries(): Promise<boolean> {
    const workbook = XLSX.readFile(join(process.cwd(), 'src/database/seeders/files/countries.xlsx'));

    const workbookSheets = workbook.SheetNames;
    const sheet = workbookSheets[0];
    const dataExcel = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);

    for (const item of dataExcel) {
      const location = {
        alpha3Code: item['alpha3'],
        code: item['codigo'],
        idTemp: item['alpha3'],
        level: 1,
        name: item['nombre'].toUpperCase()
      }

      await this.locationsService.create(location);
    }

    return true;
  }

  async importDPA(): Promise<boolean> {
    const workbook = XLSX.readFile(join(process.cwd(), 'src/database/seeders/files/dpa.xlsx'));

    const workbookSheets = workbook.SheetNames;
    const sheet = workbookSheets[0];
    const dataExcel = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);

    for (const item of dataExcel) {
      let level = 0;
      let zone = null;

      if (item['tipo_id'] == 36) {
        level = 2;
      }
      if (item['tipo_id'] == 37) {
        level = 3;
      }
      if (item['tipo_id'] == 38) {
        level = 4;
      }

      if (item['tipo_zona']) {
        zone = item['tipo_zona'];
      }

      let parentId = null;

      if (item['padre_id']) {
        const parent = await this.locationsService.findByIdTemp(item['padre_id']);
        if (parent) {
          parentId = parent.id;
        }
      }

      const location = {
        parentId,
        code: item['codigo'],
        latitude: item['latitud'],
        longitude: item['longitud'],
        level,
        name: item['nombre'],
        zone,
        idTemp: item['id'],
      }

      await this.locationsService.create(location);
    }

    return true;
  }
}
