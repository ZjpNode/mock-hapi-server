var fs = require("fs");
var path = require("path");

//解析需要遍历的文件夹，我这以E盘根目录为例
// var filePath = path.resolve("E:");

//调用文件遍历方法
// fileDisplay(filePath);

/**
 * 文件遍历方法
 * @param filePath 需要遍历的文件路径
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

module.exports = {
  fileDisplay: fileDisplay
};
