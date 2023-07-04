'use strict';
const fs = require('fs');
const upath = require('upath');
const sh = require('shelljs');

module.exports = function renderAssets() {
    const sourcePathPublic = upath.resolve(upath.dirname(__filename), '../public/*');
    const destPathPublic = upath.resolve(upath.dirname(__filename), '../dist/.');

    sh.cp('-R', sourcePathPublic, destPathPublic)
};
