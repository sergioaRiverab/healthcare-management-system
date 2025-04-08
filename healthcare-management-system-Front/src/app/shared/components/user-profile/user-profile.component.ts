import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models/User.model';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  user: User | null = null;
  isDropdownOpen = false;
  isEditProfileModalOpen = false;
  editProfileForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.editProfileForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.pattern('^[0-9]{10}$')]]
    });
  }

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
    });
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  logout(): void {
    this.authService.logout();
    this.isDropdownOpen = false;
  }

  openEditProfileModal(): void {
    this.isEditProfileModalOpen = true;
    const user = this.authService.getCurrentUser();
    if (user) {
      this.editProfileForm.patchValue({
        username: user.username || '',
        email: user.email || '',
        phone: user.phone || ''
      });
    }
  }

  closeEditProfileModal(): void {
    this.isEditProfileModalOpen = false;
  }

  onEditProfileSubmit(): void {
    if (this.editProfileForm.valid) {
      const updatedData = this.editProfileForm.value;
      this.authService.editProfile(updatedData).subscribe({
        next: (response) => {
          alert(response.message || 'Profile updated successfully');
          this.authService.loadUser(); // Refresh the user data after update
          this.closeEditProfileModal();
        },
        error: (err) => {
          console.error('Error updating profile:', err);
          alert(err.error?.message || 'Failed to update profile');
        }
      });
    } else {
      console.error('Form is invalid:', this.editProfileForm.errors, this.editProfileForm.value);
      alert('Please fill out the form correctly.');
    }
  }
}