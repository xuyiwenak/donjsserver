import path from "path";
import { HttpServer } from "tsrpc";
import {
  serviceProto as serviceProto_Public,
  ServiceType as ServiceType_Public,
} from "./shared/public/instance/front_protocols/serviceProto";
import { gameLogger } from "./util/logger";
import type { ServerGlobals } from "./common/ServerGlobal";

export let httpGameServer: HttpServer<ServiceType_Public> | undefined;

export async function initHttpServer(options: ServerGlobals) {
  httpGameServer = new HttpServer<ServiceType_Public>(serviceProto_Public, {
    port: options.httpPort!,
    logger: gameLogger,
    json: true,
    logReqBody: true,
    logResBody: true,
  });

  await httpGameServer.autoImplementApi(
    path.resolve(__dirname, "./api/public/front"),
  );
}

export async function startHttpServer() {
  if (!httpGameServer) {
    throw new Error("HttpServer not initialized");
  }

  await httpGameServer.start();
  gameLogger.info("HttpServer started at", httpGameServer.options.port);
}

