import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonsSectionComponent } from "./buttons-section/buttons-section.component";
import { HeaderComponent } from "./header/header.component";

@Component({
  standalone: true,
  selector: 'app-home-page',  // WICHTIG: anderer Selector als InitialTestPage
  imports: [ButtonsSectionComponent, HeaderComponent, RouterModule],  // RouterLink für Navigation hinzufügen
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent {
  ngOnInit() {
    console.log('HomePage geladen');
  }
}