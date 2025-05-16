import type { RegisteredComponent } from "@builder.io/sdk-angular";
import { BookFormComponent } from "./components/BookFormComponent/bookForm.component";
import { BookListComponent } from "./components/BookListComponent/bookList.component";
import { BookTableComponent } from "./components/library/book-table/book-table.component";
import { Counter } from "./components/counter.component";
import { HeaderComponent } from "./components/header/header.component";
import { LibraryComponent } from "./components/library/library.component";
import { NavComponent } from "./components/nav/nav.component";
import { SearchComponent } from "./components/library/search/search.component";

export const CUSTOM_COMPONENTS: RegisteredComponent[] = [
  {
    component: BookFormComponent,
    name: "BookFormComponent",
    inputs: [
      {
        name: "editBook",
        type: "Book",
      },
    ],
  },
  {
    component: BookListComponent,
    name: "BookListComponent",
    inputs: [
      {
        name: "books",
        type: "Book[]",
      },
    ],
  },
  {
    component: BookTableComponent,
    name: "BookTableComponent",
    inputs: [
      {
        name: "books",
        type: "Book[]",
      },
    ],
  },
  {
    component: HeaderComponent,
    name: "HeaderComponent",
  },
  {
    component: LibraryComponent,
    name: "LibraryComponent",
  },
  {
    component: NavComponent,
    name: "NavComponent",
    inputs: [
      {
        name: "selector",
        type: "string",
      },
      {
        name: "standalone",
        type: "boolean",
      },
    ],
  },
  {
    component: SearchComponent,
    name: "SearchComponent",
  },
];
