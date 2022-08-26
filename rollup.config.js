import yaml from "@rollup/plugin-yaml";
import run from "@rollup/plugin-run";

const dev = process.env.ROLLUP_WATCH === "true";

export default {
  input: "index.js",
  output: {
    dir: "dist",
    format: "cjs",
  },
  plugins: [yaml(), dev && run()],
  external: ["express", "http", "socket.io"],
};
