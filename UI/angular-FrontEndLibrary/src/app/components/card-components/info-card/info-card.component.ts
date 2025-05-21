import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfoCardColumn2, InfoCardColumn3 } from '../../../Models/interfaces/site-interfaces';
@Component({
  selector: 'app-info-card',
  standalone: true,
  templateUrl: './info-card.component.html',
  styleUrls: ['./info-card.component.css'],
  imports: [CommonModule]
})
export class InfoCardComponent {
  @Input() id: string = '';
  @Input() imageUrl: string = '';

  @Input() col2: InfoCardColumn2 = {};
  @Input() col3: InfoCardColumn3 = {};
  @Input() col2longText: string = '';

  @Output() close = new EventEmitter<void>();

  closeInfoCard() {
    this.close.emit();
  }
}