import { UrlSegment, UrlMatchResult } from '@angular/router';

export function jobCategoryMatcher(segments: UrlSegment[]): UrlMatchResult | null {
  const path = segments.map(segment => segment.path).join('/');
  // if (path.endsWith('-jobs')) {
  //   return { consumed: segments };
  // }

// Do not match if the URL starts with 'company'
  if (segments.length > 0 && segments[0].path === 'company') {
    return null;
  }

  // Match if there's exactly one segment and it ends with '-jobs'
  if (segments.length === 1 && segments[0].path.endsWith('-jobs')) {
    return { consumed: segments };
  }

  return null;

}