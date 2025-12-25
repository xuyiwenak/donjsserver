/*
 * @Author: lyh
 * @Github:
 * @FilePath: /InstanceServer/src/common/ServerGlobal.ts
 * @Date: 2024-11-28 10:10:35
 * @LastEditors: lyh
 * @LastEditTime: 2025-01-14 17:15:51
 */
export type ServerGlobals = {
  id: string;
  internalIP?: string;
  publicIP?: string;
  gameType: string;
  environment: string;
  group?: number;
  serverProvide: string;
  connectionTickTimeout: number;
  port?: number; //长连接端口
  httpPort?: number; //rpc端口
};
