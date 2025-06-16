import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root',
})
export class IndexedDbService {
  private dbName = 'MyDb';
  private dbVersion = 3;
  private db!: IDBDatabase;
  private dbReady!: Promise<void>;

  constructor() {
    this.dbReady = this.openDB();
  }

  private openDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        if (!db.objectStoreNames.contains('skaters')) {
          db.createObjectStore('skaters', { keyPath: 'id', autoIncrement: true });
        }
      };

      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        console.log('✅ IndexedDB opened successfully');
        resolve();
      };

      request.onerror = () => {
        console.error('❌ IndexedDB error:', request.error);
        reject(request.error);
      };
    });
  }

  async addSkater(skater: { name: string; lastname: string; verein: string }): Promise<number> {
  await this.dbReady;
  return new Promise((resolve, reject) => {
    const tx = this.db.transaction('skaters', 'readwrite');
    const store = tx.objectStore('skaters');
    const request = store.add(skater);

    request.onsuccess = () => resolve(request.result as number);
    request.onerror = () => reject(request.error);
  });
}

async getAllSkaters(): Promise<any[]> {
  await this.dbReady;
  return new Promise((resolve, reject) => {
    const tx = this.db.transaction('skaters', 'readonly');
    const store = tx.objectStore('skaters');
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
async deleteSkater(id: number): Promise<void> {
  await this.dbReady;
  return new Promise((resolve, reject) => {
    const tx = this.db.transaction('skaters', 'readwrite');
    const store = tx.objectStore('skaters');
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}
}

