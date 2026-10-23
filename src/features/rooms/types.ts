export type CreateRoomInput = {
  name: string;
  hostNickname: string;
  description: string;
};

export type CreateRoomErrors = Partial<Record<keyof CreateRoomInput, string>>;

export type JoinRoomInput = {
  nickname: string;
  inviteToken: string;
};
