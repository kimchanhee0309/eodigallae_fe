import { z } from "zod";

const STORAGE_KEY = "eodigallae:recent-rooms:v1";
const CHANGE_EVENT = "eodigallae:recent-rooms-changed";
const MAX_ROOMS = 10;

const recentRoomSchema = z.object({
  id: z.string().uuid(),
  name: z.string().trim().min(1).max(40),
  visitedAt: z.number().int().nonnegative(),
});

const recentRoomsSchema = z.array(recentRoomSchema).max(MAX_ROOMS);

export type RecentRoom = z.infer<typeof recentRoomSchema>;

export function getRecentRoomSnapshot(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function parseRecentRooms(raw: string | null): RecentRoom[] {
  if (!raw) {
    return [];
  }

  try {
    const result = recentRoomsSchema.safeParse(JSON.parse(raw));

    return result.success ? result.data : [];
  } catch {
    return [];
  }
}

function writeRecentRooms(rooms: RecentRoom[]): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(rooms));
    window.dispatchEvent(new Event(CHANGE_EVENT));

    return true;
  } catch {
    return false;
  }
}

export function rememberRecentRoom(room: {
  id: string;
  name: string;
}): boolean {
  const result = recentRoomSchema.safeParse({
    id: room.id,
    name: room.name,
    visitedAt: Date.now(),
  });

  if (!result.success) {
    return false;
  }

  const previous = parseRecentRooms(getRecentRoomSnapshot());

  const next = [
    result.data,
    ...previous.filter((item) => item.id !== room.id),
  ].slice(0, MAX_ROOMS);

  return writeRecentRooms(next);
}

export function removeRecentRoom(roomId: string): boolean {
  const previous = parseRecentRooms(getRecentRoomSnapshot());

  return writeRecentRooms(previous.filter((room) => room.id !== roomId));
}

export function subscribeRecentRooms(onChange: () => void): () => void {
  function handleStorage(event: StorageEvent) {
    if (event.key === STORAGE_KEY || event.key === null) {
      onChange();
    }
  }

  window.addEventListener("storage", handleStorage);

  window.addEventListener(CHANGE_EVENT, onChange);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}
