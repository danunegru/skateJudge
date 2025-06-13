import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent {
  navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
    { path: '/veranstaltung', label: 'Veranstaltung', icon: 'event' },
    { path: '/pruefling', label: 'Prüfling', icon: 'person' },
    { path: '/profil', label: 'Profil', icon: 'account_circle' }
  ];
}
