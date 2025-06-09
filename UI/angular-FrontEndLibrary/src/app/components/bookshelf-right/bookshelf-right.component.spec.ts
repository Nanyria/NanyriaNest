import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookshelfRightComponent } from './bookshelf-right.component';

describe('BookshelfRightComponent', () => {
  let component: BookshelfRightComponent;
  let fixture: ComponentFixture<BookshelfRightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookshelfRightComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookshelfRightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
