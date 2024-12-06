import { Component, inject } from '@angular/core';
import { NgxExtendedPdfViewerModule, NgxExtendedPdfViewerService } from 'ngx-extended-pdf-viewer';
import { SplitViewComponent } from '../../../shared/components/split-view.component';
import { SetMinifiedLibraryUsageDirective } from '../../../shared/directives/set-minified-library-usage.directive';
import { ContentPageComponent } from '../../../shared/components/content-page/content-page.component';
import { MarkdownContentComponent } from '../../../shared/components/markdown-content.component';
import { ButtonDirective } from '../../../core/directives/button.directive';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'pvs-accessing-raw-data-page',
  standalone: true,
  imports: [
    ContentPageComponent,
    MarkdownContentComponent,
    NgxExtendedPdfViewerModule,
    SplitViewComponent,
    SetMinifiedLibraryUsageDirective,
    ButtonDirective,
    JsonPipe,
  ],
  template: `<pvs-content-page [demoTemplate]="demo">
    <pvs-markdown src="/assets/pages/forms/accessing-raw-data/text.md" />
    <ng-template #demo>
      <pvs-split-view [stickyEnd]="true">
        <div>
          <button pvsButton (click)="readRawFormDescription()">Read low-level Form Description</button>
        </div>
        <div>
          <table>
            <tr>
              <td>Name</td>
              <td>Coordinates<br />(0, 0) = bottom left</td>
              <td>Page number</td>
              <td>Json (a small selection)</td>
            </tr>
            @for (field of rawFormData; track field) {
              <tr>
                <td>{{ field.fieldName }}</td>
                <td>{{ field.rect }}</td>
                <td>{{ field.pageNumber }}</td>
                <td>{{ field | json }}</td>
              </tr>
            }
          </table>
        </div>

        <ngx-extended-pdf-viewer
          slot="end"
          src="/assets/pdfs/OoPdfFormExample.pdf"
          zoom="auto"
          [textLayer]="true"
          [showPresentationModeButton]="true"
          pvsSetMinifiedLibraryUsage
        />
      </pvs-split-view>
    </ng-template>
  </pvs-content-page>`,
})
export class AccessingRawDataPageComponent {
  private ngxService = inject(NgxExtendedPdfViewerService);

  rawFormData: any[] = [];

  async readRawFormDescription(): Promise<void> {
    const raw = await this.ngxService.getFormData();
    this.rawFormData = raw.map((annotation: any) => ({
      alternativeText: annotation.fieldAnnotation.alternativeText,
      fieldName: annotation.fieldAnnotation.fieldName,
      value: annotation.fieldAnnotation.value,
      fieldType: annotation.fieldAnnotation.fieldType,
      fieldValue: annotation.fieldAnnotation.fieldValue,
      pageNumber: annotation.pageNumber,
      id: annotation.fieldAnnotation.id,
      maxLen: annotation.fieldAnnotation.maxLen,
      rect: annotation.fieldAnnotation.rect,
    }));
  }
}
