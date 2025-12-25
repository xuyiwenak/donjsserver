/*
 * @Author: lyh
 * @Github:
 * @FilePath: /InstanceServer/tsrpc.config.ts
 * @Date: 2024-10-25 09:22:33
 * @LastEditors: lyh
 * @LastEditTime: 2025-01-08 10:01:21
 */
import type { TsrpcConfig } from "tsrpc-cli";

export default <TsrpcConfig>{
  // Generate ServiceProto
  proto: [
    {
      ptlDir: "src/shared/public/instance/front_protocols", // Protocol dir
      output: "src/shared/public/instance/front_protocols/serviceProto.ts", // Path for generated ServiceProto
      apiDir: "src/api/public/front", // API dir
      docDir: "docs/public/front", // API documents dir
      // ptlTemplate: { baseFile: 'src/shared/type/Type.ts' },
    },
  ],
  // Sync shared code
  sync: [
    {
      // from: 'src/shared',
      // to: '../frontend/src/shared',
      // type: 'symlink'     // Change this to 'copy' if your environment not support symlink
    },
  ],
  // Dev server
  dev: {
    autoProto: true, // Auto regenerate proto
    autoSync: true, // Auto sync when file changed
    autoApi: false, // Auto create API when ServiceProto updated
    watch: "src", // Restart dev server when these files changed
    entry: "src/front.ts", // Dev server command: node -r ts-node/register {entry}
  },
  // Build config
  build: {
    autoProto: true, // Auto generate proto before build
    autoSync: true, // Auto sync before build
    autoApi: false, // Auto generate API before build
    outDir: "dist", // Clean this dir before build
  },
};
