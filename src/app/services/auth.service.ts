import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface LoginRequest {
  identifier: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  role: string;
  userId: number;
  activeChamaId?: number; // optional
  activeChamaName?: string; // optional
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
  private inviteUrl = 'http://localhost:8080/api/admin-invitations/invite';
  private acceptInviteUrl = 'http://localhost:8080/api/admin-invitations/accept';

  private tokenKey = 'authToken';
  private roleKey = 'userRole';
  private userIdKey = 'userId';
  private activeChamaKey = 'activeChamaId';
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

        if (response.userId !== undefined && response.userId !== null) {
          localStorage.setItem(this.userIdKey, response.userId.toString());
        }

        // Store active chama if available
        if (response.activeChamaId !== undefined && response.activeChamaId !== null) {
          localStorage.setItem(this.activeChamaKey, response.activeChamaId.toString());
        }

        if (response.activeChamaName) {
          localStorage.setItem(this.activeChamaNameKey, response.activeChamaName);
        }
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
    const role = this.getRole();
    return role === 'admin' || role === 'super_admin';
  }

  isSuperAdmin(): boolean {
    return this.getRole() === 'super_admin';
  }

  isUser(): boolean {
    return this.getRole() === 'user';
  }

  getCurrentUserId(): number | null {
    const userId = localStorage.getItem(this.userIdKey);
    return userId ? parseInt(userId, 10) : null;
  }

  getUserId(): number {
    const stored = localStorage.getItem(this.userIdKey);
    return stored ? parseInt(stored, 10) : 0;
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

  // ✅ New method to check if admin has a chama
  hasChama(): boolean {
    const chamaId = localStorage.getItem(this.activeChamaKey);
    return !!chamaId;
  }

  checkUsernameAvailability(username: string): Observable<{ available: boolean }> {
    return this.http.get<{ available: boolean }>(`${this.checkUsernameUrl}/${username}`);
  }

  checkEmailAvailability(email: string): Observable<{ available: boolean }> {
    return this.http.get<{ available: boolean }>(`${this.checkEmailUrl}/${email}`);
  }

  forgotPassword(email: string): Observable<string> {
    const url = `${this.baseUrl}/forgot-password`;
    return this.http.post(url, { email }, { responseType: 'text' as const });
  }

  resetPassword(token: string, newPassword: string): Observable<string> {
    const url = `${this.baseUrl}/reset-password`;
    return this.http.post(url, { token, newPassword }, { responseType: 'text' as const });
  }

  inviteAdmin(email: string): Observable<{ message: string }> {
    const token = this.getAuthToken();
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.post<{ message: string }>(this.inviteUrl, { email }, { headers });
  }

  acceptAdminInvitation(token: string, fullName: string, username: string, password: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(this.acceptInviteUrl, {
      token,
      fullName,
      username,
      password
    });
  }
}
