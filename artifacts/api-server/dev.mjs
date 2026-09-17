import { spawn } from "node:child_process";

process.env.NODE_ENV = "development";

async function run(args) {
  await new Promise((resolve, reject) => {
    const child = spawn(process.execPath, args, {
      stdio: "inherit",
    });
    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`node ${args.join(" ")} exited with code ${code}`));
      }
    });
  });
}

try {
  await run(["build.mjs"]);
  await run(["--enable-source-maps", "./dist/index.mjs"]);
} catch (err) {
  console.error(err);
  process.exit(1);
}