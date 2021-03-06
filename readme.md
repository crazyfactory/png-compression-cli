# png-compression-cli

[![npm](https://img.shields.io/npm/v/@crazyfactory/png-compression-cli.svg)](http://www.npmjs.com/package/@crazyfactory/png-compression-cli)
[![Build Status](https://travis-ci.org/crazyfactory/png-compression-cli.svg?branch=master)](https://travis-ci.org/crazyfactory/png-compression-cli)
[![dependencies Status](https://david-dm.org/crazyfactory/png-compression-cli/status.svg)](https://david-dm.org/crazyfactory/png-compression-cli)
[![devDependencies Status](https://david-dm.org/crazyfactory/png-compression-cli/dev-status.svg)](https://david-dm.org/crazyfactory/png-compression-cli?type=dev)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Greenkeeper badge](https://badges.greenkeeper.io/crazyfactory/png-compression-cli.svg)](https://greenkeeper.io/)

The CommandLine tool for converting jpg or png files to webp, recursively.

## Awsome featurn ✧٩(ˊωˋ*)و✧
This tool would search the jpg or png files by the head infomation with the files, so even the files without the ext name,they also would be found and be converted.

so enjoy it !

## Installation

    $ npm i -g @crazyfactory/png-compression-cli

## Usage

png-compression-cli allow you to convert your images within a current directory, recursively or not. It will overwrite your files with the compressed version 

After installation, just run command `pngc` in ternimal.

To convert all images within the current directory and subdirectoies, use the -r flag

    $ pngc -r
    
To choose a different folder provide it with -p flag

    $ pngc -p /var/my-images

To convert the specific image files (assets/img.jpg in this example), you may run the following command.

    $ pngc -f assets/img.jpg
    
or

    $ pngc -f assets/img1.jpg,assets/img2.png

Change the parallel number of operations by using the -c flag

    $ pngc -c 2

for more help infomation, you could run the -h flag to check it out.

    $ pngc -h

## License

Copyright (c) 2017 Wolf T. Mathes for Crazy Factory Trading Co. Ltd.

Licensed under the MIT license.

See LICENSE for more info.
