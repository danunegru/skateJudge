import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-initial-test-page',
  imports: [RouterLink],  // RouterLink für Navigation hinzufügen
  templateUrl: './initial-test-page.component.html',
  styleUrls: ['./initial-test-page.component.scss']
})
export class InitialTestPageComponent {
  ngOnInit() {
    console.log('InitialTestPage geladen');
  }
}