import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared.module';
import { NavbarComponent } from '../../navbar/navbar.component';

@Component({
  selector: 'app-user-layout',
  templateUrl: './user-layout.component.html',
  styleUrls: ['./user-layout.component.scss'],
  standalone: false // Keep false since it’s declared in AppModule
})
export class UserLayoutComponent { }
