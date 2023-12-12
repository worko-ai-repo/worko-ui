import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

const SecureStorage = require('secure-web-storage');

const SECRET_KEY: string = 'bp3vg6WRc7WUr9Dz7t27Qzv3l';

@Injectable({
  providedIn: 'root'
})
export class SecureStorageService {
  public secureStorage = new SecureStorage(
    localStorage,
    {
      hash: function hash(key: any): string {
        key = CryptoJS.HmacSHA256(key, SECRET_KEY);
        return key.toString();
      },
      encrypt: function encrypt(data: any): string {
        data = CryptoJS.AES.encrypt(data, SECRET_KEY);
        return data.toString();
      },
      decrypt: function decrypt(data: any): string {
        data = CryptoJS.AES.decrypt(data, SECRET_KEY);
        return data.toString(CryptoJS.enc.Utf8);
      }
    }
  );
}
