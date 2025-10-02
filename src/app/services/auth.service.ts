import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface LoginRequest {
  identifier: string;  // can be email or username
  password: string;
}

export interface LoginResponse {
  token: string;
  role: string;
  userId: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8080/api/auth';
  private signupUrl = `${this.baseUrl}/signup`;
  private loginUrl = `${this.baseUrl}/login`;
  private checkUsernameUrl = `${this.baseUrl}/check-username`;
  private checkEmailUrl = `${this.baseUrl}/check-email`;

  private tokenKey = 'authToken';
  private roleKey = 'userRole';
  private userIdKey = 'userId';
  private activeChamaKey = 'activeChamaId';
  private activeChamaNameKey = 'activeChamaName';

  constructor(private http: HttpClient) {}

  // ==========================
  // Auth Methods
  // ==========================
  signup(userPayload: any): Observable<any> {
    return this.http.post(this.signupUrl, userPayload);
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.loginUrl, credentials).pipe(
      tap((response: LoginResponse) => {
        this.setAuthToken(response.token);
        this.setRole(response.role);
        localStorage.setItem(this.userIdKey, response.userId.toString());
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.roleKey);
    localStorage.removeItem(this.userIdKey);
    localStorage.removeItem(this.activeChamaKey);
    localStorage.removeItem(this.activeChamaNameKey);
  }

  isAuthenticated(): boolean {
    return this.getAuthToken() !== null;
  }

  isAdmin(): boolean {
    return this.getRole() === 'admin';
  }

  isUser(): boolean {
    return this.getRole() === 'user';
  }

  getCurrentUserId(): number | null {
    const userId = localStorage.getItem(this.userIdKey);
    return userId ? parseInt(userId, 10) : null;
  }

  setAuthToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getAuthToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  setRole(role: string): void {
    localStorage.setItem(this.roleKey, role.toLowerCase());
  }

  getRole(): string | null {
    return localStorage.getItem(this.roleKey);
  }

  // ==========================
  // Real-time availability checks
  // ==========================
  checkUsernameAvailability(username: string): Observable<{ available: boolean }> {
    return this.http.get<{ available: boolean }>(`${this.checkUsernameUrl}/${username}`);
  }

  checkEmailAvailability(email: string): Observable<{ available: boolean }> {
    return this.http.get<{ available: boolean }>(`${this.checkEmailUrl}/${email}`);
  }
}