import { Schema } from 'mongoose';

export interface IPlayer {
  userId: string;
  account: string;
  password: string;
  nickname?: string;
  zoneId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const PlayerSchema = new Schema(
  {
    userId:   { type: String, required: true, unique: true },
    account:  { type: String, required: true, index: true },
    password: { type: String, required: true },
    nickname: { type: String },
    zoneId:   { type: String },
  },
  { timestamps: true }
);