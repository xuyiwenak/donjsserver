import { Document, Schema } from 'mongoose';

export interface IPlayer extends Document {
  userId: string;      // 内部唯一 ID
  account: string;     // 账号
  password: string;    // 密码（示例明文，实际建议加密）
  nickname?: string;   // 角色名
  zoneId?: string;     // 所在区服 ID
  createdAt: Date;
  updatedAt: Date;
}

export const PlayerSchema = new Schema<IPlayer>(
  {
    userId:   { type: String, required: true, unique: true },
    account:  { type: String, required: true, index: true },
    password: { type: String, required: true },
    nickname: { type: String },
    zoneId:   { type: String },
  },
  { timestamps: true }
);