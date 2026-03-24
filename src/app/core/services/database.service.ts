import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  constructor(private http: HttpClient) { }
  getPerfilNegocio(id: number): Observable<any> {
    return of({ nombre: 'Calvillo Experience', status: '¡Por fin jala!' });
  }
}