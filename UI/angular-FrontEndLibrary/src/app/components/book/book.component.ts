import { Component, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-book',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css']
})
export class BookComponent {
  @Input() width: string | null = null;
  @Input() height: string | null = null;
  @Input() thickness: string | null = null; // Optional thickness for the book
  @Input() bookColor: string | null = null;
  @Input() bookColor2: string | null = null; // Optional second color for gradient
  @Input() bookTextColor: string | null = null; // Optional text color
  @Input() bookFont: string | null = null; // Optional font family
  @Input() rotateZ: string | null = null;
  @Input() title: string = '';

  get styleVars() {
    const style: {[key: string]: string | number} = {};
    if (this.width && this.width !== 'var(--bookWidth)') style['--bookWidth'] = this.width;
    if (this.height && this.height !== 'var(--bookHeight)') style['--bookHeight'] = this.height;
    if (this.thickness && this.thickness !== 'var(--bookThickness)') style['--bookThickness'] = this.thickness;
    if (this.bookColor && this.bookColor !== 'var(--bookcolor)') style['--bookcolor'] = this.bookColor;
    if (this.bookColor2 && this.bookColor2 !== 'var(--bookcolor2)') style['--bookcolor2'] = this.bookColor2;
    if (this.bookTextColor && this.bookTextColor !== 'var(--bookTextColor)') style['--bookTextColor'] = this.bookTextColor;
    if (this.bookFont && this.bookFont !== 'var(--bookFont)') style['--bookFont'] = this.bookFont;  
    if (this.rotateZ && this.rotateZ !== 'var(--bookRotateZ)') style['--bookRotateZ'] = this.rotateZ;
    return style;
  }
}