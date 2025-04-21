import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-filter-dropdown',
  templateUrl: './filter-dropdown.component.html',
  styleUrls: ['./filter-dropdown.component.scss']
})
export class FilterDropdownComponent {

  @Input() control!: FormControl;
  @Input() options: { label: string; value: string }[] = [];
  @Input() placeholder = 'Select';

}
