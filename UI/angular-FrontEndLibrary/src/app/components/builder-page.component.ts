import { Component, Input } from '@angular/core';
import { fetchOneEntry, type BuilderContent } from '@builder.io/sdk-angular';
import { Content } from '@builder.io/sdk-angular';

import { environment } from '../../environments/environment';
import { CUSTOM_COMPONENTS } from '../builder-registry';

@Component({
  selector: 'app-builder-page',
  standalone: true,
  imports: [Content],
  template: `
    @if (content) {
      <builder-content
        [model]="model"
        [content]="content"
        [apiKey]="apiKey"
        [customComponents]="customComponents"
      ></builder-content>
    } @else {
      <div>404 - Content not found</div>
    }
  `,
})
export class BuilderPage {
  title = 'builder page';

  @Input() model: string = 'page'; // Default model is 'page'
  @Input() urlPath: string = '/'; // Default URL path

  apiKey = environment.builderApiKey;

  content: BuilderContent | null = null;

  customComponents = CUSTOM_COMPONENTS;

  async ngOnInit() {
    const builderContent = await fetchOneEntry({
      model: this.model,
      apiKey: this.apiKey,
      userAttributes: {
        urlPath: this.urlPath,
      },
    });

    if (!builderContent) {
      return;
    }

    this.content = builderContent;
  }
}
