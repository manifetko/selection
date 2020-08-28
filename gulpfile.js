const { src, dest, task, series, watch, parallel } = require("gulp");
const sass = require("gulp-sass");
const gcmq = require("gulp-group-css-media-queries");
const cleanCSS = require("gulp-clean-css");
const browserSync = require("browser-sync").create();
const autoprefixer = require("gulp-autoprefixer");
const concat = require("gulp-concat");
const babel = require("gulp-babel");
const uglify = require("gulp-uglify");
sass.compiler = require("node-sass");
var pug = require("gulp-pug");
const reload = browserSync.reload;
task("html", () => {
  return src("src/pug/*.pug")
    .pipe(pug())
    .pipe(dest("dist"));
});
const libs = ["node_modules/jquery/dist/jquery.js", "./src/js/*.js"];
task("scripts", () => {
  return src(libs)
    .pipe(concat("scripts.min.js"))
    .pipe(
      babel({
        presets: ["@babel/env"]
      })
    )
    .pipe(uglify())
    .pipe(dest("dist"));
});
task("styles", () => {
  return src("src/sass/main.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(concat("styles.min.css"))
    .pipe(autoprefixer())
    .pipe(gcmq())
    .pipe(cleanCSS())
    .pipe(dest("dist"));
});
task("server", () => {
  browserSync.init({
    server: {
      baseDir: "./dist"
    }
  });
});
watch("./src/js/*.js", series("scripts")).on("change", reload);
watch("./src/pug/**/*.pug", series("html")).on("change", reload);
watch("./src/sass/**/*.scss", series("styles")).on("change", reload);
task("default", series(parallel("styles", "scripts", "html"), "server"));
