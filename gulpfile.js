var gulp      = require("gulp");
var less      = require("gulp-less");
var plumber   = require("gulp-plumber");
var postcss   = require("gulp-postcss");
var autoprefixer  = require("autoprefixer");
var minify    = require("gulp-csso");
var rename    = require("gulp-rename");
var posthtml  = require("gulp-posthtml");
var server    = require("browser-sync").create();
var run       = require("run-sequence");
var del       = require("del");
var concat    = require("gulp-concat");
var uglify    = require("gulp-uglify");


gulp.task("style", function () {
  return gulp.src("source/less/*.less")
    .pipe(plumber())
    .pipe(less())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(concat("style.css"))
    .pipe(gulp.dest("build/css"))
    .pipe(minify())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("build/css"))
    .pipe(server.stream());
});


gulp.task("serve", function () {
  server.init({
    server: "build"
  });

  gulp.watch("source/less/*.less", ["style"]);
  gulp.watch("source/*.html", ["html"])
    .on("change", server.reload);
});


gulp.task("html", function () {
  return gulp.src("source/*.html")
    .pipe(posthtml())
    .pipe(gulp.dest("build"))
});

gulp.task("build", function (done) {
  run(
    "clean",
    "copy",
    "style",
    "html",
    done);
});

gulp.task("copy", function () {
  return gulp.src([
    "source/fonts/**.{woff2,woff}",
    "source/img/**",
    "source/js/**",
    
  ], {
    base: "source"
  })
  .pipe(gulp.dest("build"));
});

gulp.task("clean", function () {
  return del("build")
})