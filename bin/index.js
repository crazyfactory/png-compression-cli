#!/usr/bin/env node

const fs = require('fs');
const execFile = require('child_process').execFile;
const readChunk = require('read-chunk');
const imageType = require('image-type');
const zopfli = require('zopflipng-bin');
const program = require('commander');
const chalk = require('chalk');

const updateNotifier = require('update-notifier');
const pkg = require('../package.json');

updateNotifier({pkg}).notify();

let files = [];

function walk(path) {
    const dirList = fs.readdirSync(path);
    dirList.forEach(item => {
        const stats = fs.statSync(path + '/' + item);
        if (stats.isFile()) {
            const imageTypeData = imageType(readChunk.sync(path + '/' + item, 0, 12));
            if (imageTypeData) {
                if (imageTypeData.ext === 'png') {
                    files.push({
                        file: path + '/' + item,
                        size: stats.size
                    });
                }
            }
        }
    });

    if (program.recursive) {
        dirList.forEach(item => {
            if (fs.statSync(path + '/' + item).isDirectory()) {
                walk(path + '/' + item);
            }
        });
    }
}

program
    .version(pkg.version || 'dev')
    .option('-r, --recursive', 'Walk given directory recursively')
    .option('-p, --path <path>', 'A path to crawl, defaults to current working directory')
    .option('-f, --files <items>', 'the files you want to convert,split by \',\'', v => v.split(','))
    .option('-m, --more', 'Compress harder, which will take more time')
    .option('--lossy_transparent', 'Allow changing of fully transparent colors')
    .option('--lossy_8bit', 'Reduce color channels from 16bit to 8bit')
    .parse(process.argv);

if (program.files) {
    files = program.files.map(f => {
        return {
            file: f,
            size: fs.statSync(f).size
        };
    });
} else {
    walk(process.path || process.cwd());
}

console.log(chalk.yellow('Found ' + files.length + ' image file(s) !'));

files.forEach(item => {
    const args = ['-y'];
    if (program.more === true) {
        args.push('-m');
    }
    if (program.lossyTransparent === true) {
        args.push('--lossy_transparent');
    }
    if (program.lossy8bit === true) {
        args.push('--lossy_8bit');
    }
    args.push(item.file, item.file);

    execFile(zopfli, args, err => {
        if (err) {
            throw err;
        }

        item.newSize = fs.statSync(item.file).size;
        const percDiff = Math.round(((1 - (item.newSize / item.size)) * 100));

        if (percDiff > 0) {
            console.log(chalk.green(item.file + ' was compressed by ' + percDiff + '%!'));
        } else {
            console.log(chalk.gray(item.file + ' was already compressed'));
        }
    });
});
