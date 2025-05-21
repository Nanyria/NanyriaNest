import type { RegisteredComponent } from "@builder.io/sdk-angular";
import { BookFormComponent } from "./components/user-library/book-form/bookForm.component";
import { BookListComponent } from "./components/user-library/book-list/book-list.component";
import { HeaderComponent } from "./components/header/header.component";
import { InfoCardComponent } from "./components/card-components/info-card/info-card.component";
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
    component: InfoCardComponent,
    name: "InfoCardComponent",
    inputs: [
      { name: "col2", type: "InfoCardColumn2" },
      { name: "col2longText", type: "string" },
      { name: "col3", type: "InfoCardColumn3" },
      { name: "id", type: "string" },
      { name: "imageUrl", type: "string" },
    ],
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
