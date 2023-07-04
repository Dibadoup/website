'use strict';
const upath = require('upath');
const sh = require('shelljs');
const renderTwig = require('./render-twig');

const srcPath = upath.resolve(upath.dirname(__filename), '../src');

sh.find(srcPath).forEach(_processFile);

function _processFile(filePath) {
    if (
        filePath.match(/\.twig$/)
        && !filePath.match(/include/)
        && !filePath.match(/components/)
    ) {
        renderTwig(filePath);
    }
}
