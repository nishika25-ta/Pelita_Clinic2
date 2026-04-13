/** Shared with `MacOSDock` and `WhatsAppFloat` so the floating button matches dock bar height per breakpoint. */
export type DockResponsiveConfig = {
  baseIconSize: number;
  maxScale: number;
  effectWidth: number;
  baseSpacing: number;
  padX: number;
  padY: number;
};

/** Total outer height of the dock pill (`style.height` in MacOSDock). */
export function getDockBarHeightPx(c: DockResponsiveConfig): number {
  return c.baseIconSize + c.padY * 2;
}

export function getDockResponsiveConfig(viewportWidth: number): DockResponsiveConfig {
  if (viewportWidth < 360) {
    return { baseIconSize: 30, maxScale: 1.26, effectWidth: 118, baseSpacing: 4, padX: 10, padY: 8 };
  }
  if (viewportWidth < 400) {
    return { baseIconSize: 32, maxScale: 1.3, effectWidth: 128, baseSpacing: 5, padX: 10, padY: 8 };
  }
  if (viewportWidth < 480) {
    return { baseIconSize: 34, maxScale: 1.34, effectWidth: 142, baseSpacing: 6, padX: 12, padY: 9 };
  }
  if (viewportWidth < 640) {
    return { baseIconSize: 38, maxScale: 1.44, effectWidth: 168, baseSpacing: 8, padX: 14, padY: 10 };
  }
  if (viewportWidth < 768) {
    return { baseIconSize: 46, maxScale: 1.38, effectWidth: 188, baseSpacing: 10, padX: 16, padY: 12 };
  }
  return { baseIconSize: 42, maxScale: 1.42, effectWidth: 200, baseSpacing: 10, padX: 16, padY: 10 };
}
