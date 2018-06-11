const SCREEN_PRINT_PATH_REG = /\/(\d{4})\/(\d{2})\/(\d{2})\/(\d{2})\/(\d{2})\/(\d{2})\/screen\.png$/;

function isScreenPrintPath (path) {
  return SCREEN_PRINT_PATH_REG.test(path);
}

module.exports = {
  isScreenPrintPath
};
