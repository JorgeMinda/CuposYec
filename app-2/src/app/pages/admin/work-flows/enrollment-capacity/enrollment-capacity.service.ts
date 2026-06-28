// src/app/pages/admin/work-flows/enrollment-capacity/enrollment-capacity.service.ts
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EnrollmentCapacityService {
  private readonly httpClient = inject(HttpClient);
  private readonly apiUrl = `${environment.API_URL}/career-parallels`; // O el endpoint que exponga tu NestJS

  getCatalogues(): Observable<any> {
    // Aquí tu backend debe devolver los catálogos necesarios incluyendo teacher_distributions
    return this.httpClient.get<any>(`${this.apiUrl}/catalogues`);
  }

  findAll(): Observable<any> {
    return this.httpClient.get<any>(this.apiUrl);
  }

  update(id: string, payload: any): Observable<any> {
    return this.httpClient.patch<any>(`${this.apiUrl}/${id}`, payload);
  }

  remove(id: string): Observable<any> {
    return this.httpClient.delete<any>(`${this.apiUrl}/${id}`);
  }
}