/*
 * Accessibility utilities (T014) for consistent ARIA/id handling.
 */

let idCounter = 0;

/** Generate a stable unique id with rtsf prefix. */
export function generateId(prefix: string = 'rtsf'): string {
  idCounter += 1;
  return `${prefix}-${idCounter}`;
}

/** Compute error element id for a field path. */
export function getErrorId(fieldPath: string): string {
  return `rtsf-error-${sanitizePath(fieldPath)}`;
}

/** Sanitize a field path for safe usage in HTML id attributes. */
export function sanitizePath(path: string): string {
  return path.replace(/[^a-zA-Z0-9_-]/g, '-');
}

interface AriaPropsOptions {
  fieldPath: string;
  describedByErrors?: boolean;
  hasErrors?: boolean;
  required?: boolean;
}

/** Build common ARIA props for an input/control. */
export function getAriaProps(opts: AriaPropsOptions): Record<string, string | boolean> {
  const { fieldPath, describedByErrors, hasErrors, required } = opts;
  const aria: Record<string, string | boolean> = {};
  if (required) aria['aria-required'] = true;
  if (hasErrors) aria['aria-invalid'] = true;
  if (describedByErrors && hasErrors) aria['aria-describedby'] = getErrorId(fieldPath);
  return aria;
}
