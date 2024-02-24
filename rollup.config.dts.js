/* eslint-disable @typescript-eslint/no-require-imports */

const { dts } = require('rollup-plugin-dts');

module.exports = {
    input: 'src/index.ts',
    output: [
        {
            file: 'dist/esm/index.d.ts',
            format: 'es'
        }
    ],
    plugins: [dts()]
};
