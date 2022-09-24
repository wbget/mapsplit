#!/usr/bin/env node
'use strict';

const fs = require('fs');
const PNG = require('pngjs').PNG;

const name = process.argv[2];
const W = parseInt(process.argv[3]);
const H = parseInt(process.argv[4]);

const out = `res/${name}`;
fs.createReadStream(`raw/${name}.png`)
  .pipe(
    new PNG({
      filterType: -1,
    }),
  )
  .on('parsed', function () {
    const py = Math.ceil(this.height / H);
    const px = Math.ceil(this.width / W);
    for (let y = 0; y < py; y++) {
      for (let x = 0; x < px; x++) {
        const newfile = new PNG({ width: W, height: H });
        this.bitblt(newfile, x * W, this.height - (y + 1) * H, W, H);
        if (fs.existsSync(out)) {
          //   fs.rmdirSync(out, { recursive: true });
        } else {
          fs.mkdirSync(out);
        }
        const targetName = `${out}/${x}x${y}.png`;
        newfile.pack().pipe(fs.createWriteStream(targetName));
      }
    }
    // node index.js test 48 48
    console.log('split success');
  });

fs.createReadStream(`raw/${name}.png`)
  .pipe(
    new PNG({
      colorType: 0,
    }),
  )
  .on('parsed', function () {
    this.pack().pipe(fs.createWriteStream(`${out}/thumb.png`))
    // node index.js test 48 48
    console.log('thumb success');
  });
