System.config({
    defaultJSExtensions: true,
    transpiler: 'typescript',
    map: {
        typescript: 'node_modules/typescript/lib/typescript.js',
        lodash: 'node_modules/lodash/index.js'
    },
    packages: {
        'src': {
            'defaultExtension': 'ts'
        }
    },
});
