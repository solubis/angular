'use strict';

import gulp from 'gulp';
import util from 'gulp-util';
import browserSync from 'browser-sync';
import typescript from 'gulp-typescript';
import Builder from 'systemjs-builder';

const SERVER_NAME = 'SERVER';

const root = __dirname;
const config = {
    root: root,
    /**
     * The 'gulpfile' file is where our run tasks are hold.
     */
    gulp: `${root}/gulpfile.babel.js`,
    systemjs: `${root}/system.config.js`,
    typescript: `${root}/tsconfig.json`,

    /**
     * This is a collection of file patterns that refer to our app code (the
     * stuff in `src/`). These file paths are used in the configuration of
     * build tasks.
     */
    app: {
        basePath: `${root}/src/`,
        typescripts: [`${root}/src/**/!(*.spec).ts`]
    },

    /**
     * The 'build' folder is where our app resides once it's
     * completely built.
     */
    dist: {
        basePath: `${root}/dist/`,
        scripts: `${root}/dist/scripts/`
    }
};

/**
 * The 'server' task start BrowserSync and open the browser.
 */
gulp.task('server', () => {
    let server = browserSync.create(SERVER_NAME);
    let browser = 'google chrome';
    let files = [config.app.typescripts];

    server.init({
        open: true,
        port: 3000,
        directory: true,
        notify: true,
        startPath: `src/index.html`,
        files: files,
        server: {
            baseDir: './'
        },
        browser: browser
    });
});

gulp.task('typescript', () => {
    let project = typescript.createProject(
        config.typescript
    );

    let inputPath = `${config.app.typescripts}`;
    let outputPath = `${config.dist.scripts}`;

    return gulp.src(inputPath)
        .pipe(typescript(project))
        .js.pipe(gulp.dest(outputPath));
});

gulp.task('bundle', function () {
    let builder = new Builder(config.root);

    builder.loadConfig(config.systemjs)
        .then(function () {
            return builder.buildStatic(
                'src/main',
                `${config.dist.basePath}bundle.js`, {
                    minify: false,
                    mangle: false,
                    sourceMaps: true
                });
        });
});

gulp.task('default', ['server']);
