import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { HeaderComponent } from "./header/header.component";
import { AddEventAreaPlaceComponent } from "./add-event-area-place/add-event-area-place.component";

@Component({
  standalone: true,
  selector: 'app-home-page',  // WICHTIG: anderer Selector als InitialTestPage
  imports: [HeaderComponent, RouterModule, AddEventAreaPlaceComponent],  // RouterLink für Navigation hinzufügen
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent {
  constructor(private router: Router) {}

  ngOnInit() {
    console.log('HomePage geladen');
  }

  navigateToEventDetails(id: string) {
    console.log('Navigating to event ID:', id);
    this.router.navigate(['/event', id]);
  }
}