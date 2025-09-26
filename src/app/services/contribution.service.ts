import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

// DTO imports
import { ContributionDTO } from '../models/contribution.dto';
import { ContributionOwedDTO } from '../models/contribution-owed.dto';
import { ChamaRulesDTO } from '../models/chama-rules.dto';
import { MemberPayoutDTO } from '../models/member-payout.dto';

@Injectable({
  providedIn: 'root'
})
export class ContributionService {
  private baseUrl = 'http://localhost:8080/api';
  private contributionsUrl = `${this.baseUrl}/contributions`;
  private rulesUrl = `${this.baseUrl}/chama-rules`;

  constructor(private http: HttpClient) {}

  // ===== Contributions =====
  addContribution(dto: ContributionDTO): Observable<ContributionDTO> {
    return this.http.post<ContributionDTO>(this.contributionsUrl, dto, { headers: this.getAuthHeaders() });
  }

  getContributionsByMember(chamaId: number, cycle?: string, memberId?: number): Observable<ContributionDTO[]> {
    let params = new HttpParams().set('chamaId', chamaId.toString());
    if (cycle) params = params.set('cycle', cycle);
    if (memberId) params = params.set('memberId', memberId.toString());
    return this.http.get<ContributionDTO[]>(`${this.contributionsUrl}/member`, { headers: this.getAuthHeaders(), params });
  }

  getOwedAmount(chamaId: number, memberId?: number): Observable<ContributionOwedDTO> {
    let params = new HttpParams().set('chamaId', chamaId.toString());
    if (memberId) params = params.set('memberId', memberId.toString());
    return this.http.get<ContributionOwedDTO>(`${this.contributionsUrl}/member/owed`, { headers: this.getAuthHeaders(), params });
  }

  getContributionsByChama(chamaId: number, cycle?: string): Observable<ContributionDTO[]> {
    let params = new HttpParams();
    if (cycle) params = params.set('cycle', cycle);
    return this.http.get<ContributionDTO[]>(`${this.contributionsUrl}/chama/${chamaId}`, { headers: this.getAuthHeaders(), params });
  }

  getTotalContributions(chamaId: number, cycle?: string): Observable<number> {
    let params = new HttpParams();
    if (cycle) params = params.set('cycle', cycle);
    return this.http.get<number>(`${this.contributionsUrl}/chama/${chamaId}/total`, { headers: this.getAuthHeaders(), params });
  }

  getNextPayout(chamaId: number): Observable<MemberPayoutDTO> {
    return this.http.get<MemberPayoutDTO>(`${this.contributionsUrl}/chama/${chamaId}/payout`, { headers: this.getAuthHeaders() });
  }

  distributeDividends(chamaId: number): Observable<string> {
    return this.http.post<string>(`${this.contributionsUrl}/chama/${chamaId}/distribute-dividends`, {}, { headers: this.getAuthHeaders() });
  }

  getAvailableCycles(chamaId: number): Observable<string[]> {
    return this.http.get<string[]>(`${this.contributionsUrl}/chama/${chamaId}/cycles`, { headers: this.getAuthHeaders() });
  }

  // ===== Chama Rules =====
  getChamaRules(chamaId: number): Observable<ChamaRulesDTO> {
    return this.http.get<ChamaRulesDTO>(`${this.rulesUrl}/chama/${chamaId}`, { headers: this.getAuthHeaders() });
  }

  createOrUpdateChamaRules(dto: ChamaRulesDTO): Observable<ChamaRulesDTO> {
    // Always use POST for create/update, controller handles upsert
    return this.http.post<ChamaRulesDTO>(this.rulesUrl, dto, { headers: this.getAuthHeaders() });
  }

  deleteChamaRules(chamaId: number): Observable<void> {
    return this.http.delete<void>(`${this.rulesUrl}/chama/${chamaId}`, { headers: this.getAuthHeaders() });
  }

  updatePayoutOrder(chamaId: number, payoutOrder: string): Observable<ChamaRulesDTO> {
    // Pass payoutOrder in the request body
    return this.http.put<ChamaRulesDTO>(`${this.rulesUrl}/chama/${chamaId}/payout-order`, payoutOrder, { headers: this.getAuthHeaders() });
  }

  updateCurrentPayoutMember(chamaId: number, memberId: number): Observable<ChamaRulesDTO> {
    const params = new HttpParams().set('memberId', memberId.toString());
    return this.http.put<ChamaRulesDTO>(`${this.rulesUrl}/chama/${chamaId}/current-payout-member`, {}, { headers: this.getAuthHeaders(), params });
  }

  checkChamaRulesExist(chamaId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.rulesUrl}/chama/${chamaId}/exists`, { headers: this.getAuthHeaders() });
  }

  // ===== Helpers =====
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('jwtToken');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }
}
