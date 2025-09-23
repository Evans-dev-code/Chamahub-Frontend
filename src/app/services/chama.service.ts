// src/app/services/chama.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Chama {
  id: number;
  name: string;
  description: string;
  joinCode?: string;
  createdBy?: any;
}

@Injectable({
  providedIn: 'root'
})
export class ChamaService {
  private baseUrl = 'http://localhost:8080/api/chamas';

  constructor(private http: HttpClient) {}

  // Get chamas the logged-in user belongs to
  getMyChamas(): Observable<Chama[]> {
    return this.http.get<Chama[]>(`${this.baseUrl}/my-chamas`);
  }

  // Join a chama by joinCode (returns the joined Chama)
  joinChama(joinCode: string): Observable<Chama> {
    return this.http.post<Chama>(`${this.baseUrl}/join?joinCode=${encodeURIComponent(joinCode)}`, {});
  }

  // Create chama — accept single payload to match your component's call
  createChama(payload: { name: string; description: string }): Observable<Chama> {
    return this.http.post<Chama>(`${this.baseUrl}/create`, payload);
  }

  // Ask backend to (re)generate a join code for a chama
  generateJoinCode(chamaId: number): Observable<{ joinCode: string }> {
    return this.http.post<{ joinCode: string }>(`${this.baseUrl}/${chamaId}/generate-join-code`, {});
  }
}
