// // minimist解析参数
// const argv = require("minimist")(process.argv.slice(2));

// const { build } = require("esbuild");
// const { resolve } = require("path");
// const args = require("minimist")(process.argv.slice(2));

// const target = args._[0] || "reactivity";
// const format = args.f || "global";

// const pkg = require(resolve(__dirname, `../packages/${target}/package.json`));

// // life 自执行函数 global
// // cjs commonjs 规范
// // esm esMudule
// const outputFormat = format.startsWith("global") // 输出的格式
//   ? "iife"
//   : format === "cjs"
//   ? "cjs"
//   : "esm";

// // 输出的文件
// const outfile = resolve(
//   __dirname,
//   `../packages/${target}/dist/${target}.${format}.js`
// );

// build({
//   entryPoints: [resolve(__dirname, `../packages/${target}/src/index.ts`)],
//   outfile,
//   bundle: true, // 打包在一起
//   sourcemap: true, // 方便调试
//   format: outputFormat, // 输出的格式
//   globalName: pkg.buildOptions?.name,
//   platform: format === "cjs" ? "node" : "browser",
//   watch: {
//     // 监控文件变化
//     onRebuild(error) {
//       if (!error) console.log(`rebuilt~~~~`);
//     },
//   },
// }).then(() => {
//   console.log("watching~~~");
// });

const { build } = require("esbuild");
const { resolve } = require("path");

const target = "reactivity";

build({
  // 打包的入口
  entryPoints: [resolve(__dirname, `../packages/${target}/src/index.ts`)],
  outfile: resolve(__dirname, `../packages/${target}/dist/${target}.js`),
  bundle: true, // 将依赖的模块全部打包
  sourcemap: true, // 支持调试
  format: "esm", // 打包出来的模块是esm  es6模块
  platform: "browser", // 打包的结果给浏览器来使用
  watch: {
    onRebuild() {
      // 文件变化后重新构建
      console.log("rebuild~~~");
    },
  },
}).then(() => {
  console.log("watching~~~");
});
