const fs = require('fs');
const path = require('path');
const { stdout } = process;

fs.createReadStream(
  path.join(__dirname,  'text.txt'),
  'utf-8'
).on('data', chunk => stdout.write(chunk));
