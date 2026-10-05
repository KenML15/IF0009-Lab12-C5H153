import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

// Lab 12: modelo del asistente (mismos nombres que el JSON de Spring)
export interface Asistente {
  id?: number;
  nombre: string;
  correo: string;
  edad: number;
}

export interface Charla {
  id?: number;
  titulo: string;
  expositor: string;
  nivel: string;
  emailContacto: string;
  fechaInicio: string;     
  fechaFin: string;        
  etiquetas: string[];
  asistentes?: Asistente[]; 
}

@Injectable({
  providedIn: 'root'
})
export class CharlaService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/charlas';

  getCharlas(): Observable<Charla[]> {
    return this.http.get<Charla[]>(this.apiUrl);
  }

  registrarCharla(charla: Charla): Observable<Charla> {
    return this.http.post<Charla>(this.apiUrl, charla);
  }


  inscribirAsistente(charlaId: number, asistente: Asistente): Observable<Asistente> {
    return this.http.post<Asistente>(`${this.apiUrl}/${charlaId}/asistentes`, asistente);
  }
}