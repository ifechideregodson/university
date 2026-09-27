import Dexie, { type Table } from "dexie";

export type LocalRecord = {
  id: string;
  kind: string;
  payload: unknown;
  updatedAt: number;
  synced: boolean;
};

class UniversityDB extends Dexie {
  records!: Table<LocalRecord, string>;
  constructor() {
    super("online-university-db");
    this.version(1).stores({
      records: "id, kind, updatedAt, synced"
    });
  }
}

export const localDB = typeof window !== "undefined" ? new UniversityDB() : null;

export async function saveOfflineRecord(record: LocalRecord) {
  if (!localDB) return;
  await localDB.records.put(record);
}

export async function getOfflineRecords(kind?: string) {
  if (!localDB) return [];
  return kind
    ? localDB.records.where("kind").equals(kind).toArray()
    : localDB.records.toArray();
}
