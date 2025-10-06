import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-invite-admin',
  templateUrl: './invite-admin.component.html',
  styleUrls: ['./invite-admin.component.scss']
})
export class InviteAdminComponent {
  email: string = '';
  loading = false;

  private apiUrl = 'http://localhost:8080/api/admin-invitations/invite';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  sendInvite() {
    if (!this.email) {
      this.snackBar.open('⚠️ Please enter a valid email address.', 'Close', { duration: 3000 });
      return;
    }

    this.loading = true;
    const token = this.authService.getAuthToken();

    this.http.post<any>(
      this.apiUrl,
      { email: this.email },
      { headers: { Authorization: `Bearer ${token}` } }
    ).subscribe({
      next: (response) => {
        this.snackBar.open(response.message || '✅ Invitation sent successfully!', 'Close', { duration: 3000 });
        this.email = '';
        this.loading = false;
      },
      error: (err) => {
        this.snackBar.open(err.error?.message || '❌ Failed to send invitation.', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
  }
}
