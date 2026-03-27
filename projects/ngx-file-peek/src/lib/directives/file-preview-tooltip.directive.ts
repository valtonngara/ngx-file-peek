import {
  Directive,
  ElementRef,
  inject,
  input,
  OnDestroy,
  ViewContainerRef,
} from '@angular/core';
import { Overlay, OverlayRef, FlexibleConnectedPositionStrategy } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { PreviewTooltipComponent } from '../components/preview-tooltip/preview-tooltip.component';
import { FileLightboxComponent } from '../components/file-lightbox/file-lightbox.component';
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
  private lightboxOverlayRef: OverlayRef | null = null;
  private delayTimer: ReturnType<typeof setTimeout> | null = null;
  private hideTimer: ReturnType<typeof setTimeout> | null = null;
  private isPinned = false;
  private tooltipComponentRef: any = null;
  private isMouseOverTooltip = false;
  private isMouseOverHost = false;

  // Bound listeners for the overlay element
  private overlayMouseEnter = () => {
    this.isMouseOverTooltip = true;
    this.cancelHideTimer();
  };

  private overlayMouseLeave = () => {
    this.isMouseOverTooltip = false;
    this.scheduleHide();
  };

  onMouseEnter(): void {
    this.isMouseOverHost = true;
    this.cancelHideTimer();
    if (this.overlayRef) return;
    const delay = this.config.tooltipDelay ?? 300;
    this.delayTimer = setTimeout(() => this.show(), delay);
  }

  onMouseLeave(): void {
    this.isMouseOverHost = false;
    this.clearTimer();
    if (!this.isPinned) {
      this.scheduleHide();
    }
  }

  ngOnDestroy(): void {
    this.clearTimer();
    this.cancelHideTimer();
    this.hideTooltip();
    this.hideLightbox();
  }

  /** Give a short grace period for the mouse to travel from host to tooltip */
  private scheduleHide(): void {
    this.cancelHideTimer();
    this.hideTimer = setTimeout(() => {
      if (!this.isMouseOverHost && !this.isMouseOverTooltip && !this.isPinned) {
        this.hideTooltip();
      }
    }, 150);
  }

  private cancelHideTimer(): void {
    if (this.hideTimer !== null) {
      clearTimeout(this.hideTimer);
      this.hideTimer = null;
    }
  }

  private show(): void {
    if (this.overlayRef) return;

    const positionStrategy: FlexibleConnectedPositionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(this.elementRef)
      .withPositions([
        { originX: 'center', originY: 'top', overlayX: 'center', overlayY: 'bottom', offsetY: -8 },
        { originX: 'center', originY: 'bottom', overlayX: 'center', overlayY: 'top', offsetY: 8 },
        { originX: 'end', originY: 'center', overlayX: 'start', overlayY: 'center', offsetX: 8 },
        { originX: 'start', originY: 'center', overlayX: 'end', overlayY: 'center', offsetX: -8 },
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

    this.tooltipComponentRef = this.overlayRef.attach(portal);
    const url = this.filePreviewTooltip();
    const fileType = this.fileTypeService.detectType(url);
    this.tooltipComponentRef.setInput('url', url);
    this.tooltipComponentRef.setInput('fileType', fileType);

    // Attach mouse listeners to the overlay panel so tooltip stays open
    const overlayElement = this.overlayRef.overlayElement;
    overlayElement.addEventListener('mouseenter', this.overlayMouseEnter);
    overlayElement.addEventListener('mouseleave', this.overlayMouseLeave);

    const instance = this.tooltipComponentRef.instance as PreviewTooltipComponent;

    // Poll pin state from the signal
    const checkPin = setInterval(() => {
      this.isPinned = instance.pinned();
    }, 100);

    // Listen for maximize output
    instance.maximize.subscribe(() => {
      this.hideTooltip();
      this.showLightbox();
    });

    // Clean up interval when overlay is detached
    this.overlayRef.detachments().subscribe(() => {
      clearInterval(checkPin);
    });
  }

  private showLightbox(): void {
    this.lightboxOverlayRef = this.overlay.create({
      positionStrategy: this.overlay.position().global().centerHorizontally().centerVertically(),
      scrollStrategy: this.overlay.scrollStrategies.block(),
      hasBackdrop: false,
      panelClass: 'fp-lightbox-panel',
      width: '100vw',
      height: '100vh',
    });

    const portal = new ComponentPortal(
      FileLightboxComponent,
      this.viewContainerRef,
    );

    const ref = this.lightboxOverlayRef.attach(portal);
    const url = this.filePreviewTooltip();
    ref.setInput('url', url);
    ref.setInput('fileType', this.fileTypeService.detectType(url));

    ref.instance.closed.subscribe(() => {
      this.hideLightbox();
    });
  }

  private hideTooltip(): void {
    this.isPinned = false;
    this.isMouseOverTooltip = false;
    if (this.overlayRef) {
      const overlayElement = this.overlayRef.overlayElement;
      overlayElement.removeEventListener('mouseenter', this.overlayMouseEnter);
      overlayElement.removeEventListener('mouseleave', this.overlayMouseLeave);
      this.overlayRef.detach();
      this.overlayRef.dispose();
      this.overlayRef = null;
      this.tooltipComponentRef = null;
    }
  }

  private hideLightbox(): void {
    if (this.lightboxOverlayRef) {
      this.lightboxOverlayRef.detach();
      this.lightboxOverlayRef.dispose();
      this.lightboxOverlayRef = null;
    }
  }

  private clearTimer(): void {
    if (this.delayTimer !== null) {
      clearTimeout(this.delayTimer);
      this.delayTimer = null;
    }
  }
}
