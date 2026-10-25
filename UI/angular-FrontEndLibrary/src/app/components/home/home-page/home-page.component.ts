import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CardComponent } from '../../card-components/card/card.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CardComponent],
  templateUrl: './home-page.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./home-page.component.css'],
})
export class HomePageComponent {}
