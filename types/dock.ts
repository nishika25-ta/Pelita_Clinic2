import type { ReactElement } from "react";

export type DockAppItem = {
  id: string;
  name: string;
  icon: ReactElement;
  isDivider?: boolean;
  /** Skip Lucide `size` / `strokeWidth` injection (use for `<img>` or custom icons). */
  nativeIcon?: boolean;
  /** With `nativeIcon`: no white circular frame (logo asset includes its own shape). */
  nativeIconPlain?: boolean;
};
