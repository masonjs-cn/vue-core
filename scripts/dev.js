// minimist解析参数
const argv = require("minimist")(process.argv.slice(2));

const { build } = require("esbuild");
const { resolve } = require("path");
const args = require("minimist")(process.argv.slice(2));

const target = args._[0] || "reactivity";
const format = args.f || "global";

const pkg = require(resolve(__dirname, `../packages/${target}/package.json`));

// life 自执行函数 global
// cjs commonjs 规范
// esm esMudule
const outputFormat = format.startsWith("global") // 输出的格式
  ? "iife"
  : format === "cjs"
  ? "cjs"
  : "esm";

// 输出的文件
const outfile = resolve(
  __dirname,
  `../packages/${target}/dist/${target}.${format}.js`
);

build({
  entryPoints: [resolve(__dirname, `../packages/${target}/src/index.ts`)],
  outfile,
  bundle: true, // 打包在一起
  sourcemap: true, // 方便调试
  format: outputFormat, // 输出的格式
  globalName: pkg.buildOptions?.name,
  platform: format === "cjs" ? "node" : "browser",
  watch: {
    // 监控文件变化
    onRebuild(error) {
      if (!error) console.log(`rebuilt~~~~`);
    },
  },
}).then(() => {
  console.log("watching~~~");
});
