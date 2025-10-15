// src/types/pwa.d.ts
export {};

declare global {
  interface SyncManager {
    register(tag: string): Promise<void>;
  }

  interface ServiceWorkerRegistration {
    sync: SyncManager;
  }
}
