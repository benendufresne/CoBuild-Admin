import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root',
})
export class CryptoService {
  encryptValue(value: any) {
    let key = CryptoJS.enc.Utf8.parse('11d8e9810567496d98ff5285b8afec56');
    let iv = CryptoJS.enc.Utf8.parse('I8zyA4lVhMCaJ5Kk');
    let encrypted = CryptoJS.AES.encrypt(
      CryptoJS.enc.Utf8.parse(JSON.stringify(value)),
      key,
      {
        keySize: 128 / 8,
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }
    );
    return encrypted.toString();
  }

  decryptValue(value: any) {
    let key = CryptoJS.enc.Utf8.parse('11d8e9810567496d98ff5285b8afec56');
    let iv = CryptoJS.enc.Utf8.parse('I8zyA4lVhMCaJ5Kk');
    let decrypted = CryptoJS.AES.decrypt(value, key, {
      keySize: 128 / 8,
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
  }
}
