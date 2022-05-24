const { stdin, stdout } = process;
const fs = require('fs');
const path = require('path');

fs.writeFile(
  path.join(__dirname,  'text.txt'),'',
  (err) => {
    if (err) throw err;
    stdout.write('Please enter, what you wonna see in the file\n');
  }
);

const output = fs.createWriteStream(path.join(__dirname,  'text.txt'));
stdin.on('data', text => {
  if (text.toString() === 'exit\r\n') process.exit();
  output.write(text);
});
process.on('SIGINT', () => process.exit());
process.on('exit', ()=>stdout.write('GL bro!'));