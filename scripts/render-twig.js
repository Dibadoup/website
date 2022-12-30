'use strict';
const fs = require('fs');
const upath = require('upath');
const twig = require('twig');
const sh = require('shelljs');
const prettier = require('prettier');

module.exports = function rendertwig(filePath) {
    filePath = upath.resolve(filePath);
    const destPath = upath.resolve(filePath.replace(/src\/twig\//, 'dist/').replace(/\.twig$/, '.html'));

    const destPathDirname = upath.dirname(destPath);
    if (!sh.test('-e', destPathDirname)) {
        sh.mkdir('-p', destPathDirname);
    }

    console.log(`### INFO: Rendering ${filePath} to ${destPath}`);
    twig.cache(false);
    twig.renderFile(filePath, (err, html) => {
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
