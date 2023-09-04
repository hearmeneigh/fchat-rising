import * as electronRemote from '@electron/remote';
import Store from 'electron-store';

export class SecureStore {
  private store: Store<Record<string, string>>;

  constructor(storeName: string, obfuscationKey: string) {
    this.store = new Store<Record<string, string>>({
      accessPropertiesByDotNotation: true,
      clearInvalidConfig: true,
      name: storeName,
      projectName: storeName,
      watch: true,
      encryptionKey: obfuscationKey // obfuscation only
    } as any);
  }

  private getKey(domain: string, account: string): string {
    return `${domain}__${account}`;
  }

  setPassword(domain: string, account: string, password: string): void {
    if ((electronRemote as any).safeStorage.isEncryptionAvailable() === false) {
      return;
    }

    const buffer = (electronRemote as any).safeStorage.encryptString(password);

    this.store.set(this.getKey(domain, account), buffer.toString('binary'));
  }

  deletePassword(domain: string, account: string): void {
    if ((electronRemote as any).safeStorage.isEncryptionAvailable() === false) {
      return;
    }

    this.store.delete(this.getKey(domain, account));
  }

  getPassword(domain: string, account: string): string | null {
    if ((electronRemote as any).safeStorage.isEncryptionAvailable() === false) {
      return null;
    }

    const pw = this.store.get(this.getKey(domain, account));

    if (!pw) {
      return null;
    }

    const buffer = Buffer.from(pw, 'binary');
    const decrypted = (electronRemote as any).safeStorage.decryptString(buffer);

    return decrypted;
  }
}
