const fs = require('fs');
const path = require('path');
const { readdir } = require('fs/promises');

fs.mkdir(path.join(__dirname, 'project-dist'), { recursive: true }, (err) => {
  if (err) console.log(err);
});

fs.mkdir(path.join(__dirname, 'project-dist', 'assets'), { recursive: true }, (err) => {
  if (err) console.log(err);
});

fs.writeFile(path.join(__dirname, 'project-dist', 'index.html'), '', (err) => {
  if (err) console.log(err);
});

function copyCurrFile(file, addWay) {
  fs.stat(path.join(__dirname,addWay, file.name), (err, stats) => {
    if (stats.isDirectory()) {
      let way = addWay+'\\'+file.name;

      fs.mkdir(path.join(__dirname, 'project-dist', way), { recursive: true }, (err) => {
        if (err) console.log(err);
      });

      readdir(path.join(__dirname, way), {withFileTypes: true}, (err, files) => {
        if (err) console.log(err);
        return files;
      }).then( files => {
        addFile(files, way);
      });     

    } else if (stats.isFile()) {
      fs.copyFile(
        path.join(__dirname,addWay, file.name), 
        path.join(__dirname,'project-dist', addWay, file.name), 
        (err) => {
          if (err) console.log('Error Found:', err);
        }
      );
    }
  });
}

function addFile (files, addWay) {
  if (files.length>1) {
    files.forEach(file => {
      copyCurrFile(file, addWay);
    });
      
  } else {
    copyCurrFile(files[0], addWay);
  }
}

readdir(path.join(__dirname, 'assets'), {withFileTypes: true}, (err, files) => {
  if (err) return console.log(err);
  return files;
}).then(files => addFile(files, 'assets'));

function removeCurrFile(file, addWay) {
  fs.stat(path.join(__dirname, addWay, file.name), (err, stats) => {
    fs.access(path.join(__dirname,addWay,file.name), (error) => {
      if (error) {
        fs.unlink(path.join(__dirname, 'project-dist', addWay, file.name), err => {
          if(err) console.log(err);
        });
        
      }
    });
    fs.access(path.join(__dirname,  addWay, file.name), (err) => {
      if (err) return;
      else {
        if (stats.isDirectory()) {
          let way = addWay+'\\'+file.name;
          readdir(path.join(__dirname, 'project-dist',way), {withFileTypes: true}, (err, files) => { // считка папки
            if (err) console.log(err);
            return files;
          }).then( files => {
            removeFiles(files, way);
          });
        }
      }
    });
  });
}

function removeFiles(files, addWay) {
  if (files.length>1) {
    files.forEach(file => {
      removeCurrFile(file, addWay);
    });
  } else if (files.length === 1) {
    removeCurrFile(files[0], addWay);
  }
}

readdir(path.join(__dirname, 'project-dist', 'assets'), {withFileTypes: true}, (err, files) => {
  if (err) return console.log(err);
  return files;
}).then(files => removeFiles(files, 'assets'));

readdir(path.join(__dirname, 'styles'), {withFileTypes: true}, (err, files) => {
  if (err) return console.log(err);
  return files;
}).then(files => {
  const target = fs.createWriteStream(path.join(__dirname, 'project-dist','style.css'));
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

function buildHtml(files) {
  let html = '';
  fs.readFile(path.join(__dirname,  'template.html'), 'utf-8', (err, info) => {
    if (err) console.log(err);
    html = info;
    files = files.filter(file => {
      let fileTypeArr = file.name.split('.');
      return fileTypeArr[fileTypeArr.length-1] === 'html';
    });
    for (let i=0; i<files.length; i++) {
      let fileArr = files[i].name.split('.');
      let replaceData = '{{'+fileArr[0]+'}}';
      fs.readFile(path.join(__dirname,  'components', files[i].name), 'utf8', (err, data) => {
        if (err) console.log(err);
        html = html.replace(replaceData, data);
        if (i === files.length-1) {
          fs.writeFile(path.join(__dirname,  'project-dist','index.html'), html, (err) => {
            if (err) console.log(err);
          });
        }
      });
    }
  });
}

readdir(path.join(__dirname,  'components'), {withFileTypes: true}, (err, files) => {
  if (err) return console.log(err);
  return files;
}).then(files => buildHtml(files));

