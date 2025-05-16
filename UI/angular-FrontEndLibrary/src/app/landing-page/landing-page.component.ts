import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BuilderPage } from "../components/builder-page.component";

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, BuilderPage],
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent {}