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

  showCreateForm: boolean = false;
  showJoinForm: boolean = false;
  joinCode: string = '';

  isAdmin: boolean = false;

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
    this.isAdmin = this.authService.isAdmin();
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
        this.chamas = data;
        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'Failed to load chamas';
        this.loading = false;
        console.error(err);
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

        // Automatically set the new chama as active
        this.selectChama(newChama);
      },
      error: (err: any) => {
        console.error('Failed to create chama:', err);
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
        
        // Automatically set the joined chama as active
        this.selectChama(joinedChama);
      },
      error: (err: any) => {
        this.error = 'Failed to join chama. Check your join code.';
        this.loading = false;
        console.error(err);
      }
    });
  }

  // Fixed: Prevent event bubbling for button clicks inside chama card
  onGenerateCode(event: Event, chama: Chama): void {
    event.stopPropagation(); // Prevent card click
    
    if (!chama || !chama.id) return;
    this.chamaService.generateJoinCode(chama.id).subscribe({
      next: (res: { joinCode: string }) => {
        chama.joinCode = res.joinCode;
      },
      error: (err: any) => {
        console.error('Failed to generate join code:', err);
      }
    });
  }

  // Fixed: Prevent event bubbling for copy button
  copyCode(event: Event, code?: string): void {
    event.stopPropagation(); // Prevent card click
    
    if (!code) return;
    navigator.clipboard?.writeText(code).then(
      () => alert('Join code copied to clipboard'),
      (err) => {
        console.error('Copy failed', err);
        alert('Failed to copy join code');
      }
    );
  }

  // Fixed: Clean chama selection with navigation
  selectChama(chama: Chama): void {
    console.log('Selecting chama:', chama.name);
    
    // Set active chama in localStorage
    localStorage.setItem('activeChamaId', chama.id.toString());
    localStorage.setItem('activeChamaName', chama.name);
    
    // Navigate to appropriate dashboard
    if (this.isAdmin) {
      this.router.navigate(['/dashboard']);
    } else {
      this.router.navigate(['/user-dashboard']);
    }
  }
}