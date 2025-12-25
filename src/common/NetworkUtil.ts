/*
 * @Author: lyh
 * @Github:
 * @FilePath: /InstanceServer/src/common/NetworkUtil.ts
 * @Date: 2024-10-24 09:57:38
 * @LastEditors: lyh
 * @LastEditTime: 2024-11-05 15:18:23
 */
import os from 'os';

export class NetworkUtil {
  public static getLocalIPv4(): string | undefined {
    // get information of all network interfaces
    // 获取所有网络接口信息
    const networkInterfaces = os.networkInterfaces();
    let ipAddress;

    Object.keys(networkInterfaces).forEach((interfaceName) => {
      const interfaces = networkInterfaces[interfaceName];
      // traverse IPv4 address for each network interface
      // 遍历每个网络接口下的IPv4地址
      if (!interfaces) return;
      for (let i = 0; i < interfaces.length; i++) {
        const addressInfo = interfaces[i];

        if (!addressInfo.internal && addressInfo.family === 'IPv4') {
          ipAddress = addressInfo.address;
          break;
        }
      }
    });

    return ipAddress;
  }
}
