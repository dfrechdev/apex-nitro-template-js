import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import postcss from 'rollup-plugin-postcss';
import cssnano from 'cssnano';
import autoprefixer from 'autoprefixer';
import replace from 'rollup-plugin-replace';
import { uglify } from 'rollup-plugin-uglify';
import { eslint } from 'rollup-plugin-eslint';
import pkgJson from './package.json';

export default [
    {
        input: pkgJson.inputFile,
        output: {
            name: pkgJson.libraryCode,
            dir: 'dist',
            file: `${pkgJson.name}.bundle.${process.env.BUILD === 'production' ? 'min' : ''}.js`,
            format: pkgJson.outputFormat,
            sourcemap: process.env.BUILD === 'production' ? false : 'inline',
            globals: {
                apex: 'apex',
            },
        },
        external: ['apex'],
        plugins: [
            replace({
                include: './src/main.js',
                values: {
                    NPM_PACKAGE_PROJECT_NAME: process.env.npm_package_name,
                    NPM_PACKAGE_PROJECT_VERSION: process.env.npm_package_version,
                },
            }),
            postcss({
                extensions: ['.css', '.less'],
                plugins: process.env.BUILD === 'production' ? [autoprefixer(), cssnano()] : [],
                extract: `./dist/${pkgJson.name}.${process.env.BUILD === 'production' ? 'min' : ''}.css`,
            }),
            resolve({
                jsnext: true,
                main: true,
                browser: true,
            }),
            commonjs(),
            eslint({ exclude: ['node_modules/**', 'src/styles/**'] }),
            babel({
                babelrc: true,
            }),
            process.env.BUILD === 'production' ? uglify() : null,
        ],
    },
];
