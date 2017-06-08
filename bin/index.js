#!/usr/bin/env node

const fs = require('fs');
const execFile = require('child_process').execFile;
const zopfli = require('zopflipng-bin');
const program = require('commander');
const chalk = require('chalk');
const throat = require('throat');

const updateNotifier = require('update-notifier');
const pkg = require('../package.json');

const findImages = require('../src/find-images');

// Respect semantic-release
pkg.version = pkg.version || 'dev';
updateNotifier({pkg}).notify();

// Define commander
program
    .version(pkg.version || 'dev')
    .option('-r, --recursive', 'Walk given directory recursively')
    .option('-p, --path <path>', 'A path to crawl, defaults to current working directory')
    .option('-f, --files <items>', 'the files you want to convert,split by \',\'', v => v.split(','))
    .option('-c, --concurrency <number>', 'Parallel compression tasks, default 4', parseInt)
    .option('-m, --more', 'Compress harder, which will take more time')
    .option('--lossy_transparent', 'Allow changing of fully transparent colors')
    .option('--lossy_8bit', 'Reduce color channels from 16bit to 8bit')
    .option('-v, --verbose', 'display additional information')
    .parse(process.argv);

// Determine files
const files = program.files
    ? program.files
    : findImages(process.path || process.cwd(), ['png'], program.recursive);
console.log(chalk.yellow('Found ' + files.length + ' image file(s)!'));

// Create Queue
const concurrency = program.concurrency || 4;
const t = throat(concurrency);

// Fill Queue
let totalSize = 0;
let totalSaved = 0;
let compressedCount = 0;
const jobs = files.map(file => file && t(() =>
    new Promise(resolve => {
        const output = file;
        const size = fs.statSync(file).size;
        totalSize += size;

        // Set arguments
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
        args.push(file, output);

        // Begin
        if (program.verbose) {
            console.log(chalk.gray(file + ' is being compressed'));
        }
        execFile(zopfli, args, err => {
            if (err) {
                console.log(file + ' throw error!');
                throw err;
            }

            const newSize = fs.statSync(output).size;
            const percDiff = Math.round((1 - (newSize / size)) * 100);

            if (newSize < size) {
                compressedCount++;
                console.log(chalk.green(file + ' compressed by ' + (size - newSize) + ' bytes (' + percDiff + '%)'));
                totalSaved += size - newSize;
            } else {
                console.log(chalk.yellow(file + ' already compressed'));
            }

            resolve();
        });
    })
));

// Report
Promise.all(jobs).then(err => {
    const percDiff = Math.round((totalSaved / totalSize) * 100);
    console.log(err || (files.length !== compressedCount)
        ? chalk.yellow('Compressed ' + compressedCount + ' (of ' + files.length + ') file(s), saving ' + totalSaved + ' bytes! (' + percDiff + '%)')
        : chalk.green('Compressed ' + compressedCount + ' file(s), saving ' + totalSaved + ' bytes! (' + percDiff + '%)'));
});
