import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  id: number;
  fullName: string;
  email: string;
  username: string;
  role: string;
  status: string;
}

export interface Member {
  id?: number;
  phoneNumber: string;
  chamaRole: string;
  joinedDate: string;
  user: User;
  chamaId: number; // ✅ link to specific chama
}

export interface MemberDTO {
  phoneNumber: string;
  chamaRole: string;
  createdDate: string;
  userId: number;
  chamaId: number; // ✅ added for multi chama
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private adminUrl = 'http://localhost:8080/api/admin/users';
  private memberUrl = 'http://localhost:8080/api/members';

  constructor(private http: HttpClient) {}

  // ==== Admin (User Approval) Operations ====
  getPendingUsers(chamaId: number): Observable<User[]> {
    return this.http.get<User[]>(`${this.adminUrl}/pending?chamaId=${chamaId}`);
  }

  approveUser(userId: number, chamaId: number): Observable<any> {
    return this.http.put(`${this.adminUrl}/${userId}/approve?chamaId=${chamaId}`, {});
  }

  rejectUser(userId: number, chamaId: number): Observable<any> {
    return this.http.put(`${this.adminUrl}/${userId}/reject?chamaId=${chamaId}`, {});
  }

  deleteUser(userId: number, chamaId: number): Observable<any> {
    return this.http.delete(`${this.adminUrl}/${userId}?chamaId=${chamaId}`);
  }

  // ✅ User creation is now global (no chamaId)
  addUserManually(user: Partial<User & { password: string }>): Observable<User> {
    return this.http.post<User>(this.adminUrl, user);
  }

  // ==== Member Operations ====
  getAllMembers(chamaId: number): Observable<Member[]> {
    return this.http.get<Member[]>(`${this.memberUrl}?chamaId=${chamaId}`);
  }

  addMember(dto: MemberDTO): Observable<Member> {
    return this.http.post<Member>(this.memberUrl, dto);
  }

  deleteMember(memberId: number, chamaId: number): Observable<any> {
    return this.http.delete(`${this.memberUrl}/${memberId}?chamaId=${chamaId}`);
  }

  getMemberByUserId(userId: number, chamaId: number): Observable<Member> {
    return this.http.get<Member>(`${this.memberUrl}/user/${userId}?chamaId=${chamaId}`);
  }
}
