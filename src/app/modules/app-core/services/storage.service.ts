import { Injectable } from '@angular/core';
import { SecureStorageService } from './secure-storage.service';
import { BehaviorSubject, Observable } from 'rxjs';
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
  set(key: string, value: any): void {
    this.secureStorageService.secureStorage.setItem(key, value);
    //Check for detect the change in the "isRequesterSelected" localStorage only
    if(key == "isRequesterSelected"){
      this.localStorageSubject.next(value);
    }
    if(key == "requesterRequests"){
      this.notificationStorageSubject.next(value);
    }
  }

  /**
   * Get value from local storage given a key.
   *
   * @param {string} key
   * @returns {any}
   */
  get(key: string): any {
    return this.secureStorageService.secureStorage.getItem(key);
    
  }

  /**
   * Remove an item from the local storage given its key.
   *
   * @param {string} key
   * @returns {void}
   */
  remove(key: string): void {
    this.secureStorageService.secureStorage.removeItem(key);
  
  }

  /**
   * Clear local storage.
   *
   * @returns {void}
   */
  clear(): void {
    this.secureStorageService.secureStorage.clear();
  }

  /**
   * Check change in localStorage Value
   * @returns {void}
   */
  getLocalStorageValueObservable() {
    return this.localStorageSubject.asObservable();
  }

  /**
   * Check change in localStorage Value
   * @returns {void}
   */
  getNotificationLocalStorageValueObservable() {
    return this.notificationStorageSubject.asObservable();
  }
}
