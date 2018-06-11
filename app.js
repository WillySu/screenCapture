const http = require('http');
const childProcess = require('child_process');
const url = require('url');
const {
  createFolders,
  getCssFile,
  getHtmlFile,
  getFile,
  getJsFile,
  getPngFile,
  saveScreenPrint
} = require('./server/fileHelper');
const {
  isScreenPrintPath
} = require('./server/routes');

function getScreenPrint (res) {
  const fileName = 'screen';
  const fileFullName = `./${fileName}.png`;
  const cmd = `screencapture -S ${fileName}.pdf ; sips -s format png ${fileName}.pdf --out ${fileName}.png`;

  childProcess.exec(cmd, function(err){
    if (err) {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end(`Unable to generate the screen print`);
    } else {
      getPngFile({ fileName: fileFullName, res });
    }
  });
}

//create a server object:
http.createServer(function (req, res) {
  const request = url.parse(req.url, true);
  const action = request.pathname;

  if (isScreenPrintPath(action)) {
    saveScreenPrint(res);
  } else if (action === '/screenprint.png') {
    getScreenPrint(res);
  } else if (action === '/js/index.js') {
    getJsFile({ fileName: 'js/index.js', res });
  } else if (action === '/css/index.css') {
    getCssFile({ fileName: 'css/index.css', res });
  } else {
    getHtmlFile({ fileName: 'index.html', res });
  }
}).listen(4040); //the server object listens on port 8080
