import { Injectable } from "@angular/core";
import * as CryptoJS from "crypto-js";

const SecureStorage = require('secure-web-storage');

const SECRET_KEY: string = "bp3vg6WRc7WUr9Dz7t27Qzv3l";

@Injectable({
  providedIn: "root",
})
export class SecureStorageService {
  constructor() { }

  // Hashing function for keys (same as React)
  private hash(key: string): string {
    const hashedKey = CryptoJS.HmacSHA256(key, SECRET_KEY).toString();
    console.log(`[SecureStorage] Hashed Key: ${key} -> ${hashedKey}`);
    return hashedKey;
  }

  // Encrypt function for values (same as React)
  private encrypt(data: string): string {
    const encryptedData = CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
    console.log(`[SecureStorage] Encrypted Data: ${data} -> ${encryptedData}`);
    return encryptedData;
  }

  // Decrypt function for values (same as React)
  private decrypt(data: string): string {
    const bytes = CryptoJS.AES.decrypt(data, SECRET_KEY);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    console.log(`[SecureStorage] Decrypted Data: ${data} -> ${decryptedData}`);
    return decryptedData;
  }

  getItem<T>(key: string): T | null {
    const hashedKey = this.hash(key);
    const encryptedData = localStorage.getItem(hashedKey);
  
    if (!encryptedData) return null;
  
    try {
      const decryptedData = this.decrypt(encryptedData);
      console.log(`[SecureStorage] Decrypted Data: ${decryptedData}`);
  
      // If decrypted data starts with '{' or '[', attempt to parse JSON
      if (decryptedData.startsWith('{') || decryptedData.startsWith('[')) {
        return JSON.parse(decryptedData) as T;
      }
  
      // If it's a plain string, return as-is
      return decryptedData as T;
    } catch (error) {
      console.error(`[SecureStorage] Error decrypting key: ${key}`, error);
      return null;
    }
  }
  

  // Set item in localStorage
  setItem<T>(key: string, value: T): void {
    const hashedKey = this.hash(key);
    const processedValue =
      typeof value === "string" ? value : JSON.stringify(value);
    const encryptedValue = this.encrypt(processedValue);

    try {
      localStorage.setItem(hashedKey, encryptedValue);
      console.log(
        `[SecureStorage] Stored - Key: ${key} | Hashed: ${hashedKey} | Encrypted: ${encryptedValue}`
      );
    } catch (error) {
      console.error(`[SecureStorage] Error setting key: ${key}`, error);
    }
  }

  // Remove item from localStorage
  removeItem(key: string): void {
    const hashedKey = this.hash(key);
    try {
      localStorage.removeItem(hashedKey);
      console.log(
        `[SecureStorage] Item removed - Key: ${key} | Hashed: ${hashedKey}`
      );
    } catch (error) {
      console.error(`[SecureStorage] Error removing key: ${key}`, error);
    }
  }

  // Clear entire localStorage
  clear(): void {
    try {
      localStorage.clear();
      console.log("[SecureStorage] Storage cleared");
    } catch (error) {
      console.error("[SecureStorage] Error clearing storage", error);
    }
  }
}
