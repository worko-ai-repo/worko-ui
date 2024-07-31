import { UrlSegment, UrlMatchResult } from '@angular/router';

export function jobCategoryMatcher(segments: UrlSegment[]): UrlMatchResult | null {
  const path = segments.map(segment => segment.path).join('/');
  if (path.endsWith('-jobs')) {
    return { consumed: segments };
  }
  return null;
}