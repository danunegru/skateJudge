import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-first-test',
  imports: [RouterLink],
  standalone: true,
  templateUrl: './first-test.component.html',
  styleUrl: './first-test.component.scss'
})
export class FirstTestComponent {

}
