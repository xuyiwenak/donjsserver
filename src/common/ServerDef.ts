/**
 * @en server info, for cluster load balance and server list display
 * @zh 服务器信息，用于集群负载均衡，以及服务器列表显示
 */
export interface ServerState {
  /**
   * @en server type
   * @zh 服务器类型
   */
  type: number;
  /**
   * @en server ip
   * @zh 服务器 IP
   */
  ip: string;
  /**
   * @en server port
   * @zh 服务器 端口
   */
  port: number;

  userNum?: number;

  lastUpdateTime?: number;
}
