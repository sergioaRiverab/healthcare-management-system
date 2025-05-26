import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { UserProfileComponent } from '../user-profile/user-profile.component';
import { CommonModule } from "@angular/common"
import { RouterLink } from "@angular/router"




@Component({
  selector: 'app-header',
  imports: [UserProfileComponent,CommonModule,RouterLink],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: true
})
export class HeaderComponent implements OnInit {
  isAuthenticated = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.isAuthenticated = !!user;
    });
  }
}
