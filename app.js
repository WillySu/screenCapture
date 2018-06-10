const http = require('http'),
    childProcess = require('child_process'),
    fs = require('fs'),
    url = require('url');

function getFile ({ fileName, callback, res }) {
  fs.access(fileName, fs.constants.F_OK | fs.constants.R_OK, (err) => {
    if (err) {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end(`${fileName} does not exist`);
    } else {
      callback(fs.readFileSync(fileName), res);
    }
  });
}

function getScreenPrint (res) {
  const fileName = 'screen';
  const fileFullName = `./${fileName}.png`;
  const cmd = `screencapture -S ${fileName}.pdf ; sips -s format png ${fileName}.pdf --out ${fileName}.png`;

  childProcess.exec(cmd, function(err){
    if (err) {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end(`Unable to generate the screen print`);
    } else {
      getFile({
        fileName: fileFullName,
        callback: (f, r) => {
          r.writeHead(200, { 'Content-Type': 'image/png' });
          r.end(f, 'binary');
        },
        res: res
      });
    }
  });
}

//create a server object:
http.createServer(function (req, res) {
  const request = url.parse(req.url, true);
  const action = request.pathname;

  if (action == '/screenprint.png') {
    getScreenPrint(res);
  } else if (action == '/js/index.js') {
    getFile({
      fileName: 'js/index.js',
      callback: (f, r) => {
        r.writeHead(200, { 'Content-Type': 'application/x-javascript' });
        r.end(f, 'utf8');
      },
      res: res
    });
  } else {
    getFile({
      fileName: './index.html',
      callback: (f, r) => {
        r.writeHead(200, { 'Content-Type': 'text/html' });
        r.end(f, 'utf8');
      },
      res: res
    })
  }
}).listen(4040); //the server object listens on port 8080
