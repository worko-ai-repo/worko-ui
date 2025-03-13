import { Injectable } from '@angular/core';
import { SecureStorageService } from './secure-storage.service';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private localStorageSubject = new BehaviorSubject<boolean | null>(null);
  private notificationStorageSubject = new BehaviorSubject<boolean | null>(null);

  /**
   * Constructor.
   *
   * @params {SecureStorageService} secureStorageService
   */
  constructor(private secureStorageService: SecureStorageService) { }

  /**
   * Set value to local storage.
   *
   * @param {string} key
   * @param {any} value
   * @returns {void}
   */
  set<T>(key: string, value: T): void {
    this.secureStorageService.setItem(key, value);

    // Notify changes
    if (key === 'useremail') {
      this.localStorageSubject.next(true);
    }
  }

  /**
   * Get value from local storage given a key.
   *
   * @param {string} key
   * @returns {any}
   */
  get<T>(key: string): T | any {
    return this.secureStorageService.getItem<T>(key);
  }

  /**
   * Remove an item from the local storage given its key.
   *
   * @param {string} key
   * @returns {void}
   */
  remove(key: string): void {
    this.secureStorageService.removeItem(key);
  }

  /**
   * Clear local storage.
   *
   * @returns {void}
   */
  clear(): void {
    this.secureStorageService.clear();
  }

  /**
   * Observe localStorage changes
   */
  getLocalStorageValueObservable() {
    return this.localStorageSubject.asObservable();
  }

  /**
   * Observe notification storage changes
   */
  getNotificationLocalStorageValueObservable() {
    return this.notificationStorageSubject.asObservable();
  }
}
