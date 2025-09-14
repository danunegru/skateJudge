import { Injectable } from '@angular/core';

// Typ generisch für alle Datentypen
@Injectable({
  providedIn: 'root'
})
export class IndexedDbService {
  private dbName = 'SkateJudgeDB';
  private dbVersion = 1;

  //  Liste aller Stores (wie Tabellen)
  private stores = ['events', 'prueflinge', 'users'];

  constructor() {
    this.initDB();
  }

  /**
   * Initialisiert die IndexedDB mit allen Stores.
   */
  private initDB() {
    const request = indexedDB.open(this.dbName, this.dbVersion);

    request.onupgradeneeded = (event: any) => {
      const db = event.target.result;

      // 🔁 Jeden Store anlegen, wenn nicht vorhanden
      this.stores.forEach(storeName => {
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName, { keyPath: 'id' }); // "id" ist Pflichtfeld im Objekt!
        }
      });
    };

    request.onerror = () => {
      console.error('[IndexedDB] Fehler beim Öffnen:', request.error);
    };
  }

  /**
   * Öffnet die Datenbank (Promise-basiert).
   */
  private openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Speichert oder aktualisiert ein Objekt im angegebenen Store.
   */
  async saveItem<T>(storeName: string, item: T): Promise<void> {
    const db = await this.openDB();
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    store.put(item); // put = insert or update

    // Promise, das auf Abschluss der Transaktion wartet
    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error);
    });
  }

  /**
   * Holt alle Einträge aus dem angegebenen Store.
   */
  async getAll<T>(storeName: string): Promise<T[]> {
    const db = await this.openDB();
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);

    return new Promise((resolve, reject) => {
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result as T[]);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Löscht ein Objekt anhand der ID im angegebenen Store.
   */
  async deleteItem(storeName: string, id: string): Promise<void> {
    const db = await this.openDB();
    const tx = db.transaction(storeName, 'readwrite');
    tx.objectStore(storeName).delete(id);

    // Promise, das sich auflöst, wenn Transaktion abgeschlossen ist
    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error);
    });
  }

  /**
   * Leert einen Store komplett (z. B. nach erfolgreicher Synchronisation).
   */
  async clearStore(storeName: string): Promise<void> {
    const db = await this.openDB();
    const tx = db.transaction(storeName, 'readwrite');
    tx.objectStore(storeName).clear();

    // Promise, das sich auflöst, wenn Transaktion abgeschlossen ist
    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error);
    });
  }

  /**
   * Gibt die Anzahl der Einträge im Store zurück.
   */
  async countItems(storeName: string): Promise<number> {
    const db = await this.openDB();
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);

    return new Promise((resolve, reject) => {
      const request = store.count();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
}
