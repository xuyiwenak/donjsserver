import { UserInfo } from "../shared/type/Type";

export enum ETaskType {}

export type TTaskDelta = {
  userInfo: UserInfo;
  type: ETaskType;
  delta: number;
};
