export function votesKey(roomId: string) {
  return ["rooms", "votes", roomId] as const;
}
