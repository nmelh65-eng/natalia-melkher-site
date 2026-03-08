// Runtime in-memory store for admin edits
// In production replace with a real DB (Prisma, Supabase, etc.)
import type { TranslatedWork } from "@/types";
import { works as initialWorks } from "@/data/works";

declare global {
  // eslint-disable-next-line no-var
  var __worksStore: TranslatedWork[] | undefined;
}

function getStore(): TranslatedWork[] {
  if (!global.__worksStore) {
    global.__worksStore = JSON.parse(JSON.stringify(initialWorks));
  }
  return global.__worksStore;
}

export function getAllWorks(): TranslatedWork[] {
  return getStore();
}

export function getPublishedWorks(): TranslatedWork[] {
  return getStore().filter((w) => w.isPublished);
}

export function getWorkById(id: string): TranslatedWork | undefined {
  return getStore().find((w) => w.id === id);
}

export function upsertWork(work: TranslatedWork): void {
  const store = getStore();
  const idx = store.findIndex((w) => w.id === work.id);
  if (idx >= 0) store[idx] = work;
  else store.push(work);
}

export function deleteWork(id: string): void {
  const store = getStore();
  const idx = store.findIndex((w) => w.id === id);
  if (idx >= 0) store.splice(idx, 1);
}

export function togglePublish(id: string): TranslatedWork | null {
  const work = getStore().find((w) => w.id === id);
  if (!work) return null;
  work.isPublished = !work.isPublished;
  work.updatedAt = new Date().toISOString();
  return work;
}
