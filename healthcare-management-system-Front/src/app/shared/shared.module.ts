import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { UserProfileComponent } from './components/user-profile/user-profile.component';

@NgModule({
  declarations: [
    UserProfileComponent,
    // ...existing components...
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    // ...existing modules...
  ],
  exports: [
    UserProfileComponent,
    // ...existing exports...
  ]
})
export class SharedModule {}
