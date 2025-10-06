import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChamaService, Chama } from '../services/chama.service';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-chama-management',
  templateUrl: './chama-management.component.html',
  styleUrls: ['./chama-management.component.scss']
})
export class ChamaManagementComponent implements OnInit {
  chamas: Chama[] = [];
  chamaForm: FormGroup;
  loading = false;
  error: string | null = null;
  creating = false;
  showCreateForm = false;
  showJoinForm = false;
  joinCode = '';
  isAdmin = false;

  constructor(
    private fb: FormBuilder,
    private chamaService: ChamaService,
    private router: Router,
    private authService: AuthService
  ) {
    this.chamaForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.isAdmin = ['admin', 'superadmin', 'super-admin', 'super_admin'].includes(
      this.authService.getRole()?.toLowerCase() || ''
    );
    this.loadChamas();
  }

  toggleCreateForm(): void {
    this.showCreateForm = !this.showCreateForm;
    this.showJoinForm = false;
    this.error = null;
  }

  toggleJoinForm(): void {
    this.showJoinForm = !this.showJoinForm;
    this.showCreateForm = false;
    this.error = null;
  }

  loadChamas(): void {
    this.loading = true;
    this.chamaService.getMyChamas().subscribe({
      next: (data: Chama[]) => {
        this.chamas = data || [];
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load chamas';
        this.loading = false;
      }
    });
  }

  onCreateChama(): void {
    if (this.chamaForm.invalid) return;

    const { name, description } = this.chamaForm.value;
    this.creating = true;
    this.chamaService.createChama({ name, description }).subscribe({
      next: (newChama: Chama) => {
        this.chamas.unshift(newChama);
        this.chamaForm.reset();
        this.creating = false;
        this.showCreateForm = false;
        this.selectChama(newChama);
      },
      error: () => {
        this.error = 'Failed to create chama';
        this.creating = false;
      }
    });
  }

  onJoinChama(): void {
    if (!this.joinCode.trim()) {
      this.error = 'Please enter a join code';
      return;
    }
    this.loading = true;
    this.chamaService.joinChama(this.joinCode).subscribe({
      next: (joinedChama: Chama) => {
        this.chamas.unshift(joinedChama);
        this.showJoinForm = false;
        this.joinCode = '';
        this.loading = false;
        this.selectChama(joinedChama);
      },
      error: () => {
        this.error = 'Failed to join chama. Check your join code.';
        this.loading = false;
      }
    });
  }

  onGenerateCode(event: Event, chama: Chama): void {
    event.stopPropagation();
    if (!chama?.id) return;

    this.chamaService.generateJoinCode(chama.id).subscribe({
      next: (res: { joinCode: string }) => {
        chama.joinCode = res.joinCode;
      },
      error: () => {}
    });
  }

  copyCode(event: Event, code?: string): void {
    event.stopPropagation();
    if (!code) return;

    navigator.clipboard?.writeText(code).then(
      () => alert('Join code copied to clipboard'),
      () => alert('Failed to copy join code')
    );
  }

  selectChama(chama: Chama): void {
    localStorage.setItem('activeChamaId', chama.id.toString());
    localStorage.setItem('activeChamaName', chama.name);

    window.dispatchEvent(new CustomEvent('activeChamaChanged', { detail: chama.id }));

    if (this.isAdmin) {
      this.router.navigate(['/dashboard']);
    } else {
      this.router.navigate(['/user-dashboard']);
    }
  }
}
