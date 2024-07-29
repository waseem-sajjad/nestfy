import { existsSync, writeFileSync } from "fs";
import { spawn } from "child_process";
import { build } from "esbuild";

import { tsconfig } from "./tsconfig.mjs";

const main = () => {
  try {
    if (!existsSync("tsconfig.json")) {
      writeFileSync("tsconfig.json", tsconfig, "utf-8");
    }

    build({
      entryPoints: ["src/index.ts"],
      outdir: "dist",
      bundle: true,
      minify: true,
      treeShaking: true,
      sourcemap: true,
      platform: "node",
      target: ["node20"],
      format: "esm",
      external: ["@nestjs/common", "@nestjs/core", "reflect-metadata"],
    });
    spawn("tsc", ["--declaration", "--emitDeclarationOnly"], {
      stdio: "inherit",
    }).on("error", (err) => {
      console.error(err);
      // eslint-disable-next-line no-undef
      process.exit(1);
    });
  } catch (error) {
    console.error(error);
  }
};

main();
