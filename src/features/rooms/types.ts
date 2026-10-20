export type CreateRoomInput = {
  name: string;
  hostNickname: string;
  description: string;
};

export type CreateRoomErrors = Partial<Record<keyof CreateRoomInput, string>>;
