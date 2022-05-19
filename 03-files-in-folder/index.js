const fs = require('fs');
const path = require('path');
const { readdir } = require('fs/promises');

readdir(path.join(__dirname, 'secret-folder'), {withFileTypes: true}, (err, files) => {
  if (err) return console.log(err);
  return files;
}).then(files => {
  files.forEach(file => {
    if (file.isFile()) {
      fs.stat(path.join(__dirname,'secret-folder', file.name), (err, stats) => {
        if (err) console.log(err);
        console.log(`${file.name.split('.')[0]} - ${path.extname(file.name).split('.')[1]} - ${(stats.size/1024).toFixed(2)}kb`);
      });
    }
  });
});
