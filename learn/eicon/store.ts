import _ from 'lodash';

import * as remote from '@electron/remote';
import log from 'electron-log'; //tslint:disable-line:match-default-export-name
import * as fs from 'fs';
import * as path from 'path';

import { EIconRecord, EIconUpdater } from './updater';

export class EIconStore {
  protected records: EIconRecord[] = [];

  protected lookup: Record<string, EIconRecord> = {};

  protected asOfTimestamp = 0;

  protected updater = new EIconUpdater();

  async save(): Promise<void> {
    const fn = this.getStoreFilename();
    log.info('eicons.save', { records: this.records.length, asOfTimestamp: this.asOfTimestamp, fn });

    fs.writeFileSync(fn, JSON.stringify({
      asOfTimestamp: this.asOfTimestamp,
      records: this.records
    }));

    remote.ipcMain.emit('eicons.reload', { asOfTimestamp: this.asOfTimestamp });
  }

  async load(): Promise<void> {
    const fn = this.getStoreFilename();
    log.info('eicons.load', { fn });

    try {
      const data = JSON.parse(fs.readFileSync(fn, 'utf-8'));

      this.records = data?.records || [];
      this.asOfTimestamp = data?.asOfTimestamp || 0;
      this.lookup = _.fromPairs(_.map(this.records, (r) => [r.eicon, r]));

      log.info('eicons.loaded.local', { records: this.records.length, asOfTimestamp: this.asOfTimestamp });

      await this.update();

      log.info('eicons.loaded.update.remote', { records: this.records.length, asOfTimestamp: this.asOfTimestamp });
    } catch (err) {
      try {
        await this.downloadAll();
      } catch (err2) {
        log.error('eicons.load.failure', { err: err2 });
      }
    }
  }

  protected getStoreFilename(): string {
    const baseDir = remote.app.getPath('userData');
    const settingsDir = path.join(baseDir, 'data');

    return path.join(settingsDir, 'eicons.json');
  }

  async downloadAll(): Promise<void> {
    log.info('eicons.downloadAll');

    const eicons = await this.updater.fetchAll();

    this.records = eicons.records;
    this.lookup = _.fromPairs(_.map(this.records, (r) => [r.eicon, r]));

    _.each(eicons.records, (changeRecord) => this.addIcon(changeRecord));

    this.resortList();

    this.asOfTimestamp = eicons.asOfTimestamp;

    await this.save();
  }

  async update(): Promise<void> {
    log.info('eicons.update', { asOf: this.asOfTimestamp });

    const changes = await this.updater.fetchUpdates(this.asOfTimestamp);

    const removals = _.filter(changes.recordUpdates, (changeRecord) => changeRecord.action === '-');
    const additions = _.filter(changes.recordUpdates, (changeRecord) => changeRecord.action === '+');

    _.each(removals, (changeRecord) => this.removeIcon(changeRecord));
    _.each(additions, (changeRecord) => this.addIcon(changeRecord));

    this.resortList();

    this.asOfTimestamp = changes.asOfTimestamp;

    log.info('eicons.update.processed', { removals: removals.length, additions: additions.length, asOf: this.asOfTimestamp });

    if (changes.recordUpdates.length > 0) {
      await this.save();
    }
  }

  protected resortList(): void {
    _.sortBy(this.records, 'eicon');
  }

  protected addIcon(record: EIconRecord): void {
    if (record.eicon in this.lookup) {
      this.lookup[record.eicon].timestamp = record.timestamp;
      return;
    }

    const r = {
      eicon: record.eicon,
      timestamp: record.timestamp
    };

    this.records.push(r);
    this.lookup[record.eicon] = r;
  }

  protected removeIcon(record: EIconRecord): void {
    if (!(record.eicon in this.lookup)) {
      return;
    }

    delete this.lookup[record.eicon];

    const idx = this.records.findIndex((r) => (r.eicon === record.eicon));

    if (idx >= 0) {
      this.records.splice(idx, 1);
    }
  }

  search(searchString: string): EIconRecord[] {
    const lcSearch = searchString.trim().toLowerCase();
    const found = _.filter(this.records, (r) => r.eicon.indexOf(lcSearch) >= 0);

    return found.sort((a, b) => {
      if ((a.eicon.substr(0, lcSearch.length) === lcSearch) && (b.eicon.substr(0, lcSearch.length) !== lcSearch)) {
        return -1;
      }

      if ((b.eicon.substr(0, lcSearch.length) === lcSearch) && (a.eicon.substr(0, lcSearch.length) !== lcSearch)) {
        return 1;
      }

      return a.eicon.localeCompare(b.eicon);
    });
  }

  random(count: number): EIconRecord[] {
    return _.sampleSize(this.records, count);
  }

  private static sharedStore: EIconStore | undefined;

  static async getSharedStore(): Promise<EIconStore> {
    if (!EIconStore.sharedStore) {
      EIconStore.sharedStore = new EIconStore();

      await EIconStore.sharedStore.load();

      setInterval(() => EIconStore.sharedStore!.update(), 60 * 60 * 1000);
    }

    return EIconStore.sharedStore;
  }
}
