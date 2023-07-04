'use strict';

const _ = require('lodash');
const chokidar = require('chokidar');
const upath = require('upath');
const renderAssets = require('./render-assets');
const renderTwig = require('./render-twig');
const renderSCSS = require('./render-scss');

const watcher = chokidar.watch('src', {
    persistent: true,
});

let READY = false;

process.title = 'twig-watch';
process.stdout.write('Loading');
let allTwigFiles = {};

watcher.on('add', filePath => _processFile(upath.normalize(filePath), 'add'));
watcher.on('change', filePath => _processFile(upath.normalize(filePath), 'change'));
watcher.on('ready', () => {
    READY = true;
    console.log(' READY TO ROLL!');
});

_handleSCSS();

function _processFile(filePath, watchEvent) {

    if (!READY) {
        if (filePath.match(/\.twig$/)) {
            if (!filePath.match(/includes/) && !filePath.match(/mixins/) && !filePath.match(/\/twig\/layouts\//)) {
                allTwigFiles[filePath] = true;
            }
        }
        process.stdout.write('.');
        return;
    }

    console.log(`### INFO: File event: ${watchEvent}: ${filePath}`);

    if (filePath.match(/\.twig$/)) {
        return _handleTwig(filePath, watchEvent);
    }

    if (filePath.match(/\.scss$/)) {
        if (watchEvent === 'change') {
            return _handleSCSS(filePath, watchEvent);
        }
        return;
    }

    if (filePath.match(/src\/assets\//)) {
        return renderAssets();
    }

}

function _handleTwig(filePath, watchEvent) {
    if (watchEvent === 'change') {
        if (filePath.match(/includes/) || filePath.match(/mixins/) || filePath.match(/\/twig\/layouts\//)) {
            return _renderAllTwig();
        }
        return renderTwig(filePath);
    }
    if (!filePath.match(/includes/) && !filePath.match(/mixins/) && !filePath.match(/\/twig\/layouts\//)) {
        return renderTwig(filePath);
    }
}

function _renderAllTwig() {
    console.log('### INFO: Rendering All');
    _.each(allTwigFiles, (value, filePath) => {
        renderTwig(filePath);
    });
}

function _handleSCSS() {
    renderSCSS();
}
