import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { UserService, User, MemberDTO } from '../services/user.service';
import { ChamaService, Chama } from '../services/chama.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  chamas: Chama[] = [];
  selectedChamaId: number = 0; // default to 0
  addUserForm: FormGroup;

  get isAdmin(): boolean {
    return this.auth.isAdmin();
  }

  constructor(
    private userService: UserService,
    private auth: AuthService,
    private fb: FormBuilder,
    private chamaService: ChamaService
  ) {
    this.addUserForm = fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['User', Validators.required],
      phoneNumber: ['', Validators.required],
      chamaRole: ['', Validators.required],
      chamaIds: [[], Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.isAdmin) {
      this.loadChamas();
    }
  }

  loadUsers(): void {
    if (!this.selectedChamaId) return;
    this.userService.getPendingUsers(this.selectedChamaId).subscribe({
      next: (data: User[]) => (this.users = data),
      error: (err: any) => console.error('Failed to load users:', err)
    });
  }

  loadChamas(): void {
    this.chamaService.getMyChamas().subscribe({
      next: (data: Chama[]) => {
        this.chamas = data;
        if (this.chamas.length > 0) {
          this.selectedChamaId = this.chamas[0].id;
          this.loadUsers();
        }
      },
      error: (err: any) => console.error('Failed to load chamas:', err)
    });
  }

  onApprove(user: User): void {
    if (!this.selectedChamaId) return;
    this.userService.approveUser(user.id, this.selectedChamaId).subscribe(() =>
      this.loadUsers()
    );
  }

  onReject(user: User): void {
    if (!this.selectedChamaId) return;
    this.userService.rejectUser(user.id, this.selectedChamaId).subscribe(() =>
      this.loadUsers()
    );
  }

  onDelete(user: User): void {
    if (!this.selectedChamaId) return;
    this.userService.deleteUser(user.id, this.selectedChamaId).subscribe(() =>
      this.loadUsers()
    );
  }

  onAddMember(): void {
    if (this.addUserForm.invalid) return;

    const { fullName, email, username, password, role, phoneNumber, chamaRole, chamaIds } =
      this.addUserForm.value;

    this.userService.addUserManually({ fullName, email, username, password, role }).subscribe({
      next: (newUser: User) => {
        chamaIds.forEach((chamaId: number) => {
          const memberDTO: MemberDTO = {
            phoneNumber,
            chamaRole,
            createdDate: new Date().toISOString().split('T')[0],
            userId: newUser.id,
            chamaId
          };

          this.userService.addMember(memberDTO).subscribe({
            next: () => this.loadUsers(),
            error: (err: any) => console.error('Member creation failed:', err)
          });
        });

        this.addUserForm.reset({
          role: 'User',
          chamaIds: []
        });
      },
      error: (err: any) => console.error('User creation failed:', err)
    });
  }
}
