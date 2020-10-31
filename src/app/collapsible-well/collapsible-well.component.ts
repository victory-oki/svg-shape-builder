import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'collapsible-well',
  templateUrl: './collapsible-well.component.html',
  styleUrls: ['./collapsible-well.component.scss']
})
export class CollapsibleWellComponent implements OnInit {
  @Input() title
  isVisible = true
  constructor() { }

  ngOnInit(): void {
  }
  toggleVisibility(){
    this.isVisible = !this.isVisible
  }
}
