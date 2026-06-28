import { LocationEntity } from '@core/entities';

export class LocationDto {
  readonly parent: LocationEntity;
  readonly code: string;
  readonly name: string;
  readonly latitude: number;
  readonly longitude: number;
  readonly level: number;
  readonly zone: string;
  readonly idTemp: string;
}
