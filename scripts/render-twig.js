'use strict';
const fs = require('fs');
const upath = require('upath');
const twig = require('twig');
const sh = require('shelljs');
const prettier = require('prettier');

module.exports = function rendertwig(filePath) {
    const destPath = filePath.replace(/src\/twig\//, 'dist/').replace(/\.twig$/, '.html');
    const srcPath = upath.resolve(upath.dirname(__filename), '../src');
    const destPathDirname = upath.dirname(destPath);
    if (!sh.test('-e', destPathDirname)) {
        sh.mkdir('-p', destPathDirname);
    }

    console.log(`### INFO: Rendering ${filePath} to ${destPath}`);
    twig.renderFile(filePath, {
        // vars
    }, (err, html) => {
        const prettified = prettier.format(html, {
            printWidth: 1000,
            tabWidth: 4,
            singleQuote: true,
            proseWrap: 'preserve',
            endOfLine: 'lf',
            parser: 'html',
            htmlWhitespaceSensitivity: 'ignore'
        });

        fs.writeFileSync(destPath, prettified);
        console.log(`### INFO: Rendered ${filePath} to ${destPath}`);
    });
};
