const fs = require('fs');
const path = require('path');
const { readdir } = require('fs/promises');

fs.mkdir(path.join(__dirname, 'files-copy'), { recursive: true }, (err) => {
  if (err) console.log(err);
});

readdir(path.join(__dirname, 'files'), {withFileTypes: true}, (err, files) => {
  if (err) return console.log(err);
  return files;
}).then(files => {
  files.forEach(file => {
    fs.copyFile(
      path.join(__dirname,'files',file.name), 
      path.join(__dirname,'files-copy',file.name), 
      (err) => {
        if (err) {
          console.log('Error Found:', err);
        }
      }
    );
  });
});

readdir(path.join(__dirname, 'files-copy'), {withFileTypes: true}, (err, files) => {
  if (err) return console.log(err);
  return files;
}).then(files => {
  files.forEach(file => {
    fs.access(path.join(__dirname,'files',file.name), (error) => {
      if (error) {
        fs.unlink(path.join(__dirname, 'files-copy', file.name), err => {
          if(err) throw err;
        });
      }
    });
  });
});
