import type { RegisteredComponent } from "@builder.io/sdk-angular";
import { BookFormComponent } from "./components/user-library/book-form/bookForm.component";
import { BookListComponent } from "./components/user-library/book-list/book-list.component";
import { Counter } from "./components/counter.component";
import { HeaderComponent } from "./components/header/header.component";
import { LibraryComponent } from "./components/user-library/library-page/library.page.component";
import { NavComponent } from "./components/nav/nav.component";
import { SearchComponent } from "./components/user-library/search/search.component";

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
