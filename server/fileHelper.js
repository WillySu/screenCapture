const fs = require('fs');
const childProcess = require('child_process');

function getFile ({ fileName, success, res }) {
  fs.access(fileName, fs.constants.F_OK | fs.constants.R_OK, (err) => {
    if (err) {
      r.writeHead(200, { 'Content-Type': 'text/plain' });
      r.end(`${fileName} does not exist`, 'utf8');
    } else {
      success(fs.readFileSync(fileName), res);
    }
  });
}

function createFolder ({ pathList, index, res, callback }) {
  const path = pathList[index];

  if (index >= pathList.length) {
    return callback(res);
  }

  fs.access(path, fs.constants.F_OK, (res) => ((err) => {
    if (err) {
      fs.mkdir(path, (err) => {
        createFolder({ pathList, index: index + 1, res, callback });
      })
    } else {
      createFolder({ pathList, index: index + 1, res, callback });
    }
  })(res));
}

function createFolders ({ folderList, res, callback }) {
  let path = '.';
  const pathList = folderList.reduce((list, folder) => {
    path += `/${folder}`;
    list.push(path);
   return list
  }, []);

  return createFolder({ pathList, index: 0, res, callback });
}

function getPngFile ({ fileName, res }) {
  getFile({
    fileName,
    success: (f, r) => {
      r.writeHead(200, { 'Content-Type': 'image/png' });
      r.end(f, 'binary');
    },
    res: res
  });
}

function getJsFile ({ fileName, res }) {
  getFile({
    fileName,
    success: (f, r) => {
      r.writeHead(200, { 'Content-Type': 'application/x-javascript' });
      r.end(f, 'utf8');
    },
    res: res
  });
}

function getCssFile ({ fileName, res }) {
  getFile({
    fileName,
    success: (f, r) => {
      r.writeHead(200, { 'Content-Type': 'text/css' });
      r.end(f, 'utf8');
    },
    res: res
  });
}

function getHtmlFile ({ fileName, res }) {
  getFile({
    fileName,
    success: (f, r) => {
      r.writeHead(200, { 'Content-Type': 'text/html' });
      r.end(f, 'utf8');
    },
    res: res
  });
}

function addLeadingZero (num) {
  return ('0' + num).substr(-2);
}

function saveScreenPrint (res) {
  const now = new Date();
  const year = now.getFullYear();
  const month = addLeadingZero(now.getMonth() + 1);
  const date = addLeadingZero(now.getDate());
  const hour = addLeadingZero(now.getHours());
  const minute = addLeadingZero(now.getMinutes());
  const second = addLeadingZero(now.getSeconds());
  const folderList = [year, month, date, hour, minute, second];
  const fileName = 'screen';
  const fileFullName = `./${folderList.join('/')}/${fileName}.png`;

  createFolders({ folderList, res, callback: ((res) => () => {
    const cmd = `screencapture -S ${fileName}.pdf ; sips -s format png ${fileName}.pdf --out ${fileFullName}`;

    childProcess.exec(cmd, ((res) => (err) => {
        if (err) {
          res.writeHead(200, { 'Content-Type': 'text/plain' });
          res.end('Unable to generate the screen print', 'utf8');
        } else {
          // getPngFile({ fileName: fileFullName, res });
          res.writeHead(200, { 'Content-Type': 'text/plain' });
          res.end(fileFullName, 'utf8');
        }
      }
    )(res)
  );
  })(res)});
}

module.exports = {
  createFolders,
  getCssFile,
  getHtmlFile,
  getFile,
  getJsFile,
  getPngFile,
  saveScreenPrint
};
