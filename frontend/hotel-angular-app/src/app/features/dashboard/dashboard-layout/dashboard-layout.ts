import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Composants partagés
import { NavbarComponent } from '../../../shared/components/navbar/navbar'
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar'

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NavbarComponent,
    SidebarComponent
  ],
  templateUrl: './dashboard-layout.html',
  styleUrls: ['./dashboard-layout.scss']
})
export class DashboardLayoutComponent {
  sidebarOpened = true;

  toggleSidebar(): void {
    this.sidebarOpened = !this.sidebarOpened;
  }
}