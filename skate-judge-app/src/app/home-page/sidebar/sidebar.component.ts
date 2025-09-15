import { Component, ElementRef, HostListener } from '@angular/core';
import { NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [NgIf, RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  visible = true;
  animating = false;
  expanded = false;

  constructor(private elRef: ElementRef) {}

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

  // Klick außerhalb der Sidebar -> toggleExpand nur ausführen, wenn expanded true
  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const clickedInsideSidebar = this.elRef.nativeElement.contains(event.target);
    const clickedShowButton = (event.target as HTMLElement).classList.contains('show-btn');

    if (!clickedInsideSidebar && !clickedShowButton && this.expanded) {
      this.toggleExpand();
    }
  }
}
