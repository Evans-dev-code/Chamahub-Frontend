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
  private signupUrl = 'http://localhost:8080/api/auth/signup';
  private loginUrl = 'http://localhost:8080/api/auth/login';

  private tokenKey = 'authToken';
  private roleKey = 'userRole';
  private userIdKey = 'userId';
  private activeChamaKey = 'activeChamaId'; // 👈 clear this on logout too
  private activeChamaNameKey = 'activeChamaName';

  constructor(private http: HttpClient) {}

  signup(userPayload: any): Observable<any> {
    return this.http.post(this.signupUrl, userPayload);
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.loginUrl, credentials).pipe(
      tap((response: LoginResponse) => {
        this.setAuthToken(response.token);
        this.setRole(response.role);
        localStorage.setItem(this.userIdKey, response.userId.toString());
        // Active chama is not set here; user selects after login
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
}
