import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent{
  pageTitle = '';

  constructor(private router: Router, private route: ActivatedRoute) {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => {
          let child = this.route.firstChild;
          while (child?.firstChild) {
            child = child.firstChild;
          }
          return child?.snapshot.data?.['title'] ?? '';
        })
      )
      .subscribe(title => {
        this.pageTitle = title;
      });
  }

//  navItems = [
//     { path: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
//     { path: '/veranstaltung', label: 'Veranstaltung', icon: 'event' },
//     { path: '/pruefling', label: 'Prüfling', icon: 'person' },
//     { path: '/profil', label: 'Profil', icon: 'account_circle' }
//   ];


}




