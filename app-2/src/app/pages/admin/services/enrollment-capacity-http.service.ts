import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { Observable, forkJoin, map } from 'rxjs';
import { HttpResponseInterface } from '../../auth/interfaces/http-response.interface';

@Injectable({
    providedIn: 'root'
})
export class EnrollmentCapacityHttpService {
    private readonly _httpClient = inject(HttpClient);
    private readonly _apiUrl = `${environment.API_URL}`;

    /**
     * Obtiene los catálogos unificados incluyendo la consulta real a school-periods
     */
    findCatalogues(): Observable<any> {
        return forkJoin({
            careers: this._httpClient.get<HttpResponseInterface>(`${this._apiUrl}/careers`),
            teacherDistributions: this._httpClient.get<HttpResponseInterface>(`${this._apiUrl}/teacher-distributions/catalogue`),
            academicPeriods: this._httpClient.get<HttpResponseInterface>(`${this._apiUrl}/catalogues/catalogue?type=ACADEMIC_PERIOD`),
            // CORRECCIÓN DE LA RUTA REAL SEGÚN SUPABASE:
          schoolPeriods: this._httpClient.get<HttpResponseInterface>(`${this._apiUrl}/school-periods`),
            parallels: this._httpClient.get<HttpResponseInterface>(`${this._apiUrl}/catalogues/catalogue?type=PARALLEL`),
            workdays: this._httpClient.get<HttpResponseInterface>(`${this._apiUrl}/catalogues/catalogue?type=ENROLLMENTS_WORKDAY`)
        }).pipe(
            map((responses) => ({
                careers: responses.careers?.data || [],
                teacherDistributions: responses.teacherDistributions?.data || [],
                academicPeriods: responses.academicPeriods?.data || [],
                schoolPeriods: responses.schoolPeriods?.data || [], // Extrae el arreglo de la base
                parallels: responses.parallels?.data || [],
                workdays: responses.workdays?.data || []
            }))
        );
    }

    /**
     * Obtiene los paralelos (career_parallels) de una carrera específica
     */
    findAll(careerId: string): Observable<any> {
        return this._httpClient.get<HttpResponseInterface>(`${this._apiUrl}/careers/${careerId}/parallels`).pipe(
            map((response) => response?.data || [])
        );
    }

    /**
     * Lista las aulas disponibles
     */
    findClassrooms(): Observable<any> {
        return this._httpClient.get<HttpResponseInterface>(`${this._apiUrl}/classrooms`).pipe(
            map((response) => response?.data || [])
        );
    }

    /**
     * Consulta la capacidad puntual de una celda
     */
    findCapacityByCareer(careerId: string, parallelId: string, workdayId: string, academicPeriodId: string): Observable<number> {
        return this._httpClient.get<HttpResponseInterface>(
            `${this._apiUrl}/career-parallels/capacity/${careerId}/${parallelId}/${workdayId}/${academicPeriodId}`
        ).pipe(
            map((response) => response?.data ?? 0)
        );
    }

    /**
     * Crea un nuevo cupo de paralelo
     */
    register(payload: any): Observable<any> {
        return this._httpClient.post<HttpResponseInterface>(`${this._apiUrl}/career-parallels`, payload).pipe(
            map((response) => response.data)
        );
    }

    update(id: string, payload: any): Observable<any> {
        return this._httpClient.put<HttpResponseInterface>(`${this._apiUrl}/career-parallels/${id}`, payload).pipe(
            map((response) => response.data)
        );
    }

    remove(id: string): Observable<any> {
        return this._httpClient.delete<HttpResponseInterface>(`${this._apiUrl}/career-parallels/${id}`).pipe(
            map((response) => response.data)
        );
    }
}