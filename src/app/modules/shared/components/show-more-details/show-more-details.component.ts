import { Component, ElementRef, EventEmitter, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

export interface ScorePoint {
  heading: string;
  detail?: string;
}

@Component({
  selector: 'app-show-more-details',
  templateUrl: './show-more-details.component.html',
  styleUrls: ['./show-more-details.component.scss']
})
export class ShowMoreDetailsComponent {
  @Input() title: string = '';
  @Input() matchingScore: any = '';
  @Input() details: string = '';
  @Output() onCancel: EventEmitter<any> = new EventEmitter<any>();
  showCloseButton: boolean = true;

  scorePoints: ScorePoint[] = [];

  constructor(private router: Router) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['details']) {
      this.parseScorePoints(this.details);
    }
  }

  cancelBtn() {
    this.onCancel.emit();
  }
  async ngOnInit(): Promise<void> {
    if (this.router.url.includes('/company')) {
      this.showCloseButton = false;
    }
  }

  parseScorePoints(text: any): void {
    const points: { heading: string; detail?: string }[] = [];

    // 1. New format: Already a valid array
    // Handle JSON stringified array
  if (typeof text === 'string') {
    try {
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed) && parsed.every(item => item.heading)) {
        text = parsed; // assign parsed array back to text
      } else {
        console.warn('Parsed string is not a valid array of score points.');
      }
    } catch (e) {
      console.warn('JSON parse failed, attempting legacy parsing.');
    }
  }

  // Now handle as array
  if (Array.isArray(text) && text.every(item => item.heading)) {
    const mergedPoints: { heading: string; detail?: string }[] = [];
    const concernDetails: string[] = [];

    for (const item of text) {
      if (item.heading === 'Area of Concern') {
        if (item.detail) concernDetails.push(`- ${item.detail}`);
      } else {
        mergedPoints.push(item);
      }
    }

    if (concernDetails.length > 0) {
      mergedPoints.push({
        heading: 'Area of Concern',
        detail: concernDetails.join('\n')
      });
    }

    this.scorePoints = mergedPoints;
    return;
  }

    // 2. Try to parse stringified JSON
    if (typeof text === 'string') {
      try {
        const parsed = JSON.parse(text);
        if (Array.isArray(parsed) && parsed.every(item => item.heading)) {
          this.scorePoints = parsed;
          return;
        } else {
          console.warn('Parsed structure invalid for score points.');
        }
      } catch (e) {
        console.warn('JSON parse failed, attempting legacy parsing.');
      }
    }

    const legacyText = typeof text === 'string' ? text : '';

    // 3. Fallback: Numbered format (e.g., 1. Heading: Detail)
    const numberRegex = /(?:^|\n)(\d+)\.\s+(.*?)(?=\n\d+\.|\n*$)/gs;
    const numberMatches = Array.from(legacyText.matchAll(numberRegex));

    if (numberMatches.length > 0) {
      for (const match of numberMatches) {
        const fullPoint = match[2].trim();
        const splitIndex = fullPoint.indexOf(':');
        if (splitIndex !== -1) {
          const heading = fullPoint.slice(0, splitIndex).trim();
          const detail = fullPoint.slice(splitIndex + 1).trim();
          points.push({ heading, detail });
        } else {
          points.push({ heading: fullPoint });
        }
      }
      this.scorePoints = points;
      return;
    }

    // 4. Fallback: Bullet points using •
    const bulletRegex = /•\s*(.*?)(?=\n•|$)/gs;
    const bulletMatches = Array.from(legacyText.matchAll(bulletRegex));

    if (bulletMatches.length > 0) {
      for (const match of bulletMatches) {
        const fullPoint = match[1].trim();
        const splitIndex = fullPoint.indexOf(':');
        if (splitIndex !== -1) {
          const heading = fullPoint.slice(0, splitIndex).trim();
          const detail = fullPoint.slice(splitIndex + 1).trim();
          points.push({ heading, detail });
        } else {
          points.push({ heading: fullPoint });
        }
      }
      this.scorePoints = points;
      return;
    }

    // 5. Fallback: Dash with Markdown-style bold headings
    const dashRegex = /-\s+\*\*(.*?)\*\*:\s*(.*?)(?=\n-|$)/gs;
    const dashMatches = Array.from(legacyText.matchAll(dashRegex));

    if (dashMatches.length > 0) {
      for (const match of dashMatches) {
        const heading = match[1].trim();
        const detail = match[2].trim();
        points.push({ heading, detail });
      }
      this.scorePoints = points;
      return;
    }

    // 6. If nothing matched
    this.scorePoints = [];
    console.warn('No recognizable format found for score points.');
  }


}
