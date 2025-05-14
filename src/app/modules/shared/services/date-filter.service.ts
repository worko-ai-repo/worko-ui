import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateFilterService {

  constructor() { }

  /**
   * Converts a given IST date to its equivalent UTC ISO string.
   * Assumes the input date is already in IST.
   * 
   * @param istDate - Date object in IST
   * @returns UTC date as ISO string
   */
  convertISTToUTC(istDate: Date): string {
    const utcDate = new Date(istDate.getTime()); // Cloning the IST date
    return utcDate.toISOString(); // Converts to ISO format in UTC
  }

  /**
   * Returns the UTC ISO string of the start of the given 'from' date in IST (00:00:00).
   * 
   * @param fromDate - Input date string or Date object
   * @returns UTC ISO string for start of day or empty string if input is null/undefined
   */
  getUTCFromDate(fromDate: string | Date | null): string {
    if (!fromDate) return '';
    const istDate = new Date(fromDate);
    istDate.setHours(0, 0, 0, 0); // Set time to 00:00:00 IST
    return this.convertISTToUTC(istDate);
  }

  /**
   * Returns the UTC ISO string of the end of the given 'to' date in IST (23:59:59.999).
   * 
   * @param toDate - Input date string or Date object
   * @returns UTC ISO string for end of day or empty string if input is null/undefined
   */
  getUTCToDate(toDate: string | Date | null): string {
    if (!toDate) return '';
    const istDate = new Date(toDate);
    istDate.setHours(23, 59, 59, 999); // Set time to 23:59:59.999 IST
    return this.convertISTToUTC(istDate);
  }
}
