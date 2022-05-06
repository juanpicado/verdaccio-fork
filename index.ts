import { spawn } from "child_process";

const child = spawn("node", [
  require.resolve("verdaccio/bin/verdaccio"),
  "-c",
  "./verdaccio.yaml",
]);

child.stdout.on("data", (data) => {
  process.stdout.write(data.toString());
});

child.on("exit", () => {
  console.log("exit");
});

setTimeout(() => {
  child.kill();
}, 2000);
