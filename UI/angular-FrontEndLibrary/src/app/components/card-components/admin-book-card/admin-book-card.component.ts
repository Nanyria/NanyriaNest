import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfoCardColumn2, InfoCardColumn3 } from '../../../Models/interfaces/site-interfaces';
import { ACTION_ICON_MAP } from '../../../Helpers/action-icons/action-icon-map';

@Component({
  selector: 'app-admin-book-card',
  standalone: true,
  templateUrl: './admin-book-card.component.html',
  styleUrls: ['./admin-book-card.component.css'],
  imports: [CommonModule]
})
export class AdminBookCardComponent {
  @Input() id: string = '';
  @Input() imageUrl: string = '';
  @Input() actions: { label: string, action: () => void, disabled?: boolean }[] = [];
  @Input() col2: InfoCardColumn2 = {};
  @Input() col3: InfoCardColumn3 = {};
  @Input() col2longText: string = '';

  @Output() close = new EventEmitter<void>();
  selectedCol3List: any[] | null = null;
  actionIconMap = ACTION_ICON_MAP;
  onCol3RowClick(row: any) {
    if (Array.isArray(row.value)) {
      this.selectedCol3List = row.value;
    } else {
      this.selectedCol3List = null;
    }
  }

  clearCol4() {
    this.selectedCol3List = null;
  }

  closeInfoCard() {
    this.close.emit();
  }
}