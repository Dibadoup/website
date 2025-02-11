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
      if (err) {
        console.error('[Twig] render error', err);
        return;
      }

      prettier.format(html, {
        printWidth: 1000,
        tabWidth: 4,
        singleQuote: true,
        proseWrap: 'preserve',
        endOfLine: 'lf',
        parser: 'html',
        htmlWhitespaceSensitivity: 'ignore'
      }).then((prettifiedHtml) => {
        fs.writeFileSync(destPath, prettifiedHtml);
        console.log(`### INFO: Rendered ${filePath} to ${destPath}`);
      }).catch((err) => console.error('[Twig] error', err))
    });
};
