import * as electronRemote from '@electron/remote';
import settings from 'electron-settings';

export class SecureStore {
  constructor(protected storeName: string) {
  }

  private getKey(domain: string, account: string): string {
    return `${this.storeName}__${domain}__${account}`.replace(/[^a-zA-Z0-9_]/g, '__');
  }

  async setPassword(domain: string, account: string, password: string): Promise<void> {
    if ((electronRemote as any).safeStorage.isEncryptionAvailable() === false) {
      return;
    }

    const buffer = (electronRemote as any).safeStorage.encryptString(password);

    await settings.set(this.getKey(domain, account), buffer.toString('binary'));
  }

  async deletePassword(domain: string, account: string): Promise<void> {
    if ((electronRemote as any).safeStorage.isEncryptionAvailable() === false) {
      return;
    }

    await settings.unset(this.getKey(domain, account));
  }

  async getPassword(domain: string, account: string): Promise<string | null> {
    if ((electronRemote as any).safeStorage.isEncryptionAvailable() === false) {
      return null;
    }

    const pw = await settings.get(this.getKey(domain, account));

    if (!pw) {
      return null;
    }

    const buffer = Buffer.from(pw.toString(), 'binary');
    const decrypted = (electronRemote as any).safeStorage.decryptString(buffer);

    return decrypted;
  }
}
