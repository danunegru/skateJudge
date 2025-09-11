import { Component } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [NgIf],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  visible = true;
  animating = false;
  expanded = false;

  hide() {
    this.visible = false;
    this.animating = true;
  }

  show() {
    this.visible = true;
    this.animating = true;
  }

  onTransitionEnd() {
    if (!this.visible) {
      this.animating = false;
    }
  }

  toggleExpand() {
    this.expanded = !this.expanded;
  }
}