import { Component } from '@angular/core';

import { BuilderPage } from '../components/builder-page.component';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [BuilderPage],
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css'],
})
export class LandingPageComponent {}
