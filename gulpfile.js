const es = require('event-stream');
const gulp = require('gulp');
const concat = require('gulp-concat');
const connect = require('gulp-connect');
const proxy = require('http-proxy-middleware');
const templateCache = require('gulp-angular-templatecache');
const ngAnnotate = require('gulp-ng-annotate');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');
const cached = require('gulp-cached');
const remember = require('gulp-remember');
const sourcemaps = require('gulp-sourcemaps');
const htmlmin = require('gulp-htmlmin');
const clean = require('gulp-clean');
const runSequence = require('run-sequence');
const through2 = require('through2');
const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const libs = require('smartadmin-libs');

const scripts = require('./app.scripts.json');
const apps = require('./app.entries');
const cssTimes = require('./app.css');

const babelOption = {
  presets: [
    ['env', {
      'targets': {
        'browsers': ['last 2 versions', 'safari >= 7']
      }
    }]
  ]
};
console.log("cssTimes", cssTimes);

let appName = argv('app');
let app = apps[appName];
// http://10.0.1.51:8081
let upstream = argv('upstream', 'http://10.0.1.51:9909'); // 10.0.1.51:9909  10.0.1.16:9909
let internalUpstream = argv('internalUpstream', 'http://10.0.1.51:9999'); // http://127.0.0.1:9909
let statisticUpstream = argv('statisticUpstream', 'http://127.0.0.1:8078');
let port = argv('port', '8889');

if (!app) {
  const appIndex = parseInt(appName);
  if (_.isInteger(appIndex)) {
    appName = _.keys(apps)[appIndex];
    app = apps[appName];
  }
}

if (!app) {
  console.log('请使用 --app={app name} 指定目标');
  throw 'no app';
}

const destinations = {
  js: `dist/${appName}`
};
const appBundleName = `app${new Date().getTime()}`;
const appBundle = `${appBundleName}.js`;

if (app.index) {
  app.index = app.index.replace('%app', `apps/${appName}`);
} else {
  app.index = 'index.html';
}

app.src = app.src.map(i => {
  return i.replace('%app', `apps/${appName}`);
});

app.tpl = app.tpl.map(i => {
  return i.replace('%app', `apps/${appName}`);
});

gulp.task('build', function () {
  return es.merge(gulp.src(app.src), getTemplateStream())
    .pipe(concat(appBundle))
    .pipe(babel(babelOption))
    .pipe(ngAnnotate())
    .pipe(uglify({
      compress: {
        drop_console: true
      }
    }))
    .pipe(gulp.dest(destinations.js));
});

gulp.task('js', function () {

  const babelTask = babel(babelOption);

  return es.merge(gulp.src(app.src), getTemplateStream())
    .pipe(sourcemaps.init())
    .pipe(cached('app_js'))
    .pipe(babelTask)
    .on('error', err => {
      console.error(err.stack);
      babelTask.end();
    })
    .pipe(remember('app_js'))
    .pipe(concat(appBundle))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(destinations.js))
    .pipe(connect.reload());
});

gulp.task('watch', function () {
  console.log('监视', app.src, app.tpl);
  gulp.watch(app.src, ['js']);
  gulp.watch(app.tpl, ['js']);
});

gulp.task('connect', function () {
  server = connect.server({
    port: port,
    host: '0.0.0.0',
    root: [destinations.js, './'],
    livereload: true,
    middleware: function () {
      return [
        proxy(['/supplier', '/huashang/bi'], {
          target: upstream,
          changeOrigin: false,
          logLevel: 'debug'
        }),
        proxy(['/api/master-data', '/api/background', '/account'], {
          target: internalUpstream,
          changeOrigin: false,
          logLevel: 'debug'
        }),
        proxy(['/statistics-url'], {
          target: statisticUpstream,
          changeOrigin: false,
          logLevel: 'debug'
        })
      ];
    }
  });
});

gulp.task('vendor', function () {

  const packaged = [];
  const bundles = app.bundles;

  _.forIn(scripts.chunks, function (chunkScripts, chunkName) {

    const paths = _.map(
      _.filter(_.union(chunkScripts), function (key) {
        return packaged.indexOf(key) < 0;
      }),

      function (script) {

        let scriptFileName = libs.find(script);

        if (!scriptFileName) {
          scriptFileName = scripts.paths[script];
        }

        if (scriptFileName instanceof Array) {
          scriptFileName = scriptFileName[scripts.debug ? 0 : 1];
        }

        if (!fs.existsSync(__dirname + '/' + scriptFileName)) {
          throw console.error('Required path doesn\'t exist: ' + __dirname + '/' + scriptFileName, script);
        }

        packaged.push(script);

        return scriptFileName;
      });

    // 查找对应的配置
    const chunkConfig = _.find(bundles, function (i) {
      return _.isObject(i) && i.chunk === chunkName;
    });

    let vendorBundle = chunkName + '.js';
    let output = destinations.js;

    // 根据应用配置，修改输出配置
    if (chunkConfig) {
      output = path.join(destinations.js, chunkConfig.output);
    }

    gulp.src(paths)
      .pipe(concat(vendorBundle))
      .on('error', swallowError)
      .pipe(gulp.dest(output));
  });
});

gulp.task('index.html', function () {

  gulp.src(app.polyfill)
    .pipe(concat('polyfill.js'))
    .pipe(uglify({
      compress: {
        drop_console: true
      }
    }))
    .pipe(gulp.dest(destinations.js));

  gulp.src(app.index)
    .pipe(through2.obj(function (chunk, enc, cb) {

      const bundles = _.concat(
        _.filter(_.clone(app.bundles), i => !i.lazy),
        appBundleName);

      const bundleScripts = bundles.map(function (name) {
        return `<script src="${name}.js"></script>`;
      }).join('');

      const content = String(chunk.contents);
      let newContent = content.replace('</body>', bundleScripts + '</body>');

      cssTimes.forEach(name => {
        newContent = newContent.replace(`${name}.css`, `${name}.css?${new Date().getTime()}`)
      });

      chunk.contents = new Buffer(newContent);

      this.push(chunk);
      cb();

    }))
    .pipe(htmlmin({collapseWhitespace: true, removeComments: true}))
    .pipe(gulp.dest(destinations.js));
});

gulp.task('clean', function () {
  // 在生产打包时，清空一次目录
  return gulp.src(`${destinations.js}/*`, {read: false})
    .pipe(clean());
});

gulp.task('use-mock-backend', function () {
  // 指定后端地址为 mock server 端口
  upstream = 'http://localhost:3000';
});

gulp.task('copy', function () {
  if (!app.copy) {
    return;
  }

  app.copy.forEach(function (i) {
    gulp.src(i.src, {base: i.base, buffer: false})
      .pipe(gulp.dest(destinations.js));
  });
});

gulp.task('prod', function (callback) {
  runSequence(
    'clean',
    ['vendor', 'build', 'index.html', 'copy'],
    callback);
});
gulp.task('dev', function (callback) {
  runSequence(
    'clean',
    ['use-uncompressed-scripts', 'vendor', 'js', 'watch', 'index.html', 'copy', 'connect'],
    callback);
});
gulp.task('dev:mock', ['use-mock-backend', 'dev']);
gulp.task('use-uncompressed-scripts', function (callback) {
  scripts.debug = true;
  callback();
});
gulp.task('default', ['dev']);

function swallowError(error) {
  console.log(error.toString());
  this.emit('end');
}

function getTemplateStream() {
  return gulp.src(app.tpl)
    .pipe(htmlmin({collapseWhitespace: true, removeComments: true}))
    .pipe(templateCache({
      root: 'app/',
      module: 'app'
    }));
}

function argv(name, def) {
  const prefix = `--${name}=`;
  const arg = process.argv.find(i => i.startsWith(prefix));
  if (arg) {
    return arg.replace(prefix, '');
  } else {
    return def || null;
  }
}
