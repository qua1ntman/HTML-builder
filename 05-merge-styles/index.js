const fs = require('fs');
const path = require('path');
const { readdir } = require('fs/promises');

fs.writeFile(path.join(__dirname, 'project-dist','bundle.css'), '', (err) => {
  if (err) console.log(err);
});

readdir(path.join(__dirname, 'styles'), {withFileTypes: true}, (err, files) => {
  if (err) return console.log(err);
  return files;
}).then(files => {
  const target = fs.createWriteStream(path.join(__dirname, 'project-dist','bundle.css'));
  files.forEach(file => {
    if (file.isFile()) {
      let type = file.name.split('.');
      type = type[type.length-1];
      if (type === 'css') {
        fs.createReadStream(path.join( __dirname, 'styles', file.name,), 'utf-8')
          .on('data', chunk => target.write(chunk));
      }
      
    }
  });
});
