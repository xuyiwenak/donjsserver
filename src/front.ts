/*
 * @Author: lyh
 * @Github:
 * @FilePath: /InstanceServer/src/front.ts
 * @Date: 2024-10-28 16:17:41
 * @LastEditors: lyh
 * @LastEditTime: 2025-01-08 10:06:01
 */

import { ComponentManager, EComName } from "./common/BaseComponent";

import { ServerGlobals } from "./common/ServerGlobal";
import { websocketGameServer } from "./common/WebsocketGameServer";

import { GlobalVarComponent } from "./component/GlobalVarComponent";
import { SysCfgComponent } from "./component/SysCfgComponent";
import { MongoComponent } from "./component/front/MongoComponent";
import { PlayerComponent } from "./component/PlayerComponent";

import { gameLogger, gameLogger as logger } from "./util/logger";
import { stopFrontServer } from "./util/tool";
import { initHttpServer, startHttpServer } from "./httpServer";

// Entry function
async function main() {
  const args: ServerGlobals = {
    id: process.env.id!,
    internalIP: process.env.internalIP,
    publicIP: process.env.publicIP,
    gameType: process.env.gameType!,
    group:
      process.env.group === undefined ? Number(process.env.group) : undefined,
    environment: process.env.environment!,
    connectionTickTimeout: Number(process.env.connectionTickTimeout),
    port: Number(process.env.port),
    httpPort: Number(process.env.httpPort),
    serverProvide: "",
  };
  logger.debug("ServerGlobals----->", args);
  //-------------------------组件相关begin-----------------------------------------
  const globalVarComp: GlobalVarComponent = new GlobalVarComponent();
  gameLogger.debug("globalVarComp-------->");
  globalVarComp.init(args);
  ComponentManager.instance.register(
    EComName.GlobalVarComponent,
    globalVarComp
  );

  const sysCfgComp: SysCfgComponent = new SysCfgComponent();
  gameLogger.debug("sysCfgComp-------->");
  ComponentManager.instance.register(EComName.SysCfgComponent, sysCfgComp);

  /*-----------------------------com begin--------------------------------------*/

  // 数据库相关组件：负责初始化 Mongo 连接和各区模型
  const mongoComp: MongoComponent = new MongoComponent();
  ComponentManager.instance.register("MongoComponent", mongoComp);

  // 玩家组件：依赖 SysCfgComponent 和按区初始化后的 Player Model
  const playerComp: PlayerComponent = new PlayerComponent();
  ComponentManager.instance.register("PlayerComponent", playerComp);

  /*-----------------------------com end--------------------------------------*/

  await ComponentManager.instance.startAll();
  await ComponentManager.instance.afterStartAll();
  //-------------------------组件相关end-----------------------------------------

  // 启动 HTTP API Server（基于 ServiceType）
  await initHttpServer(args);
  await startHttpServer();

  swaggui();
  await websocketGameServer.init(args);
  await websocketGameServer.start();
}

main();

process.on("uncaughtException", function (err) {
  logger.error("Unhandled exception:", err);
});

process.on("unhandledRejection", function (reason) {
  logger.error("Unhandled rejection:", reason);
});

process.on("SIGINT", () => {
  gameLogger.log("SIGINT----->");
  stopFrontServer();
});

process.on("SIGTERM", () => {
  gameLogger.log("SIGTERM----->");
  stopFrontServer();
});

if (process.platform === "win32") {
  process.on("message", (msg) => {
    if (msg === "shutdown") {
      // PM2 发来的“关机”消息
      gameLogger.log("[pm2] 开始优雅关闭...");
      // 关库、停队列、flush 日志等
      stopFrontServer();
    }
  });
}

function swaggui() {
  const globalVarComp = ComponentManager.instance.getComponent(
    EComName.GlobalVarComponent
  );
  if (globalVarComp.globalVar.environment === "development") {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const swaggerUi = require("swagger-ui-express");
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const express = require("express");
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const swaggerFile = require("../docs/public/front/openapi.json");

    const app = express();
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));
    app.listen(39999, () => {
      console.log("Swagger UI is running on http://localhost:39999/api-docs");
    });
  }
}
