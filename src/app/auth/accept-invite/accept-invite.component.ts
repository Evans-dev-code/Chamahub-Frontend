import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-accept-invite',
  templateUrl: './accept-invite.component.html',
  styleUrls: ['./accept-invite.component.scss']
})
export class AcceptInviteComponent implements OnInit {
  token: string | null = null;
  fullName = '';
  username = '';
  password = '';
  loading = false;

  private apiUrl = 'http://localhost:8080/api/admin-invitations/accept';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token');
  }

  acceptInvite() {
    if (!this.token) {
      this.snackBar.open('❌ Invalid or missing invitation token.', 'Close', { duration: 3000 });
      return;
    }

    if (!this.fullName || !this.username || !this.password) {
      this.snackBar.open('⚠️ Please fill in all required fields.', 'Close', { duration: 3000 });
      return;
    }

    this.loading = true;

    this.http.post<any>(this.apiUrl, {
      token: this.token,
      fullName: this.fullName,
      username: this.username,
      password: this.password
    }).subscribe({
      next: (response) => {
        this.snackBar.open(response.message || '✅ Account created successfully!', 'Close', { duration: 3000 });
        this.loading = false;
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err) => {
        this.snackBar.open(err.error?.message || '❌ Failed to accept invitation.', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
  }
}
