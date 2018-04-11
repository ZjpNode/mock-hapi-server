const fs = require("fs");
const path = require("path");
const Boom = require("boom");
const CONSTANT = require(path.resolve("./common/constant"));
/**
 * 文件遍历方法
 * @param {*} filePath 需要遍历的文件夹
 * @param {*} fileObj  返回的文件对象，默认为空
 * @returns { Array } filePath目录下的所有文件
 */
function fileDisplay(filePath, fileObj) {
  //根据文件路径读取文件，返回文件列表
  let fileList = fileObj || [];
  let files = fs.readdirSync(filePath);

  files.forEach(function(filename) {
    //获取当前文件的绝对路径
    let filedir = path.join(filePath, filename);
    //根据文件路径获取文件信息，返回一个fs.Stats对象
    let stats = fs.statSync(filedir);
    var isFile = stats.isFile(); //是文件
    var isDir = stats.isDirectory(); //是文件夹
    if (isFile) {
      fileList.push(filedir);
    }
    if (isDir) {
      fileDisplay(filedir, fileList); //递归，如果是文件夹，就继续遍历该文件夹下面的文件
    }
  });

  return fileList;
}

/**
 * 请求返回值格式化
 * @param {Boolean} flag 成功与否的标识
 * @param {Object} msg 返回的内容
 * @returns {Object} 格式{ success: flag, data: msg, err: msg }
 */
function responseFormat(flag, msg) {
  let result = { success: flag, data: "", err: "" };
  if (flag) {
    result.data = msg;
  } else {
    result.err = msg;
  }
  return result;
}

/**
 * hapi的route.config.validate.failAction函数返回值格式化
 * 由于使用了Boom模块，故只适用于自带Boom模块的hapi
 * @param {string} errMsg 错误信息
 * @returns Boom<Data> Boom错误对象
 */
function failActionReturnFormat(errMsg) {
  let error = Boom.badData("your data is bad and you should feel bad"); // 422
  // 修改http头的Status Code，定义为成功回调
  error.output.statusCode = 200;
  // 使error.output.statusCode = 200;生效
  error.reformat();
  // 用自定义的返回参数覆盖hapi自带的error、statusCode、message字段
  error.output.payload = responseFormat(false, errMsg);
  return error;
}

/**
 * 从全局global配置信息global[CONSTANT.CONFIG]，
 * 若global不存在配置信息，则require config下的配置文件,并放入缓存中
 * @param {string} key common下文件的名称，不带后缀
 * @returns {object} key对应的配置信息
 */
function getConfig(key) {
  global[CONSTANT.CONFIG] = global[CONSTANT.CONFIG]
    ? global[CONSTANT.CONFIG]
    : {};
  if (!global[CONSTANT.CONFIG][key]) {
    global[CONSTANT.CONFIG][key] = require(path.resolve(
      `${CONSTANT.CONFIG_DIR}/${key}.js`
    ));
  }
  return global[CONSTANT.CONFIG][key];
}

module.exports = {
  fileDisplay: fileDisplay,
  responseFormat: responseFormat,
  getConfig: getConfig,
  failActionReturnFormat: failActionReturnFormat
};
