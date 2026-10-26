import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

// Lets the topbar's Filters button open and close the library's filter panel
@Injectable({ providedIn: 'root' })
export class LibraryUiService {
  private readonly filtersToggledSource = new Subject<void>();
  readonly filtersToggled$ = this.filtersToggledSource.asObservable();

  toggleFilters(): void {
    this.filtersToggledSource.next();
  }
}
