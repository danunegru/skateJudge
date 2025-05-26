import { Component } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
@Component({
  selector: 'app-first-test',
  standalone: true,
  imports: [RouterLink,RouterModule],
  templateUrl: './first-test.component.html',
  styleUrl: './first-test.component.scss'
})
export class FirstTestComponent {

}
