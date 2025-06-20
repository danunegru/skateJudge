import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-a1',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './a1.component.html',
  styleUrl: './a1.component.scss'
})
export class A1Component implements OnInit {
  eventId: string | null = null;
  examId: string | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.eventId = this.route.snapshot.paramMap.get('eventId');
    this.examId = this.route.snapshot.paramMap.get('examId');
  }
}
