import {
  Directive,
  ElementRef,
  inject,
  input,
  OnDestroy,
  Injector,
  ViewContainerRef,
} from '@angular/core';
import { Overlay, OverlayRef, FlexibleConnectedPositionStrategy } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { PreviewTooltipComponent } from '../components/preview-tooltip/preview-tooltip.component';
import { FileTypeService } from '../services/file-type.service';
import { FILE_PREVIEW_CONFIG } from '../models/file-preview.tokens';

@Directive({
  selector: '[filePreviewTooltip]',
  standalone: true,
  host: {
    '(mouseenter)': 'onMouseEnter()',
    '(mouseleave)': 'onMouseLeave()',
  },
})
export class FilePreviewTooltipDirective implements OnDestroy {
  filePreviewTooltip = input.required<string>();

  private readonly overlay = inject(Overlay);
  private readonly elementRef = inject(ElementRef);
  private readonly viewContainerRef = inject(ViewContainerRef);
  private readonly fileTypeService = inject(FileTypeService);
  private readonly config = inject(FILE_PREVIEW_CONFIG);

  private overlayRef: OverlayRef | null = null;
  private delayTimer: ReturnType<typeof setTimeout> | null = null;

  onMouseEnter(): void {
    const delay = this.config.tooltipDelay ?? 300;
    this.delayTimer = setTimeout(() => this.show(), delay);
  }

  onMouseLeave(): void {
    this.clearTimer();
    this.hide();
  }

  ngOnDestroy(): void {
    this.clearTimer();
    this.hide();
  }

  private show(): void {
    if (this.overlayRef) return;

    const positionStrategy: FlexibleConnectedPositionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(this.elementRef)
      .withPositions([
        { originX: 'center', originY: 'top', overlayX: 'center', overlayY: 'bottom', offsetY: -8 },
        { originX: 'center', originY: 'bottom', overlayX: 'center', overlayY: 'top', offsetY: 8 },
      ]);

    this.overlayRef = this.overlay.create({
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      panelClass: 'fp-tooltip-panel',
    });

    const portal = new ComponentPortal(
      PreviewTooltipComponent,
      this.viewContainerRef,
    );

    const componentRef = this.overlayRef.attach(portal);
    const url = this.filePreviewTooltip();
    componentRef.setInput('url', url);
    componentRef.setInput('fileType', this.fileTypeService.detectType(url));
  }

  private hide(): void {
    if (this.overlayRef) {
      this.overlayRef.detach();
      this.overlayRef.dispose();
      this.overlayRef = null;
    }
  }

  private clearTimer(): void {
    if (this.delayTimer !== null) {
      clearTimeout(this.delayTimer);
      this.delayTimer = null;
    }
  }
}
