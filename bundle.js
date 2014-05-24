var fs = require('fs');

function cut(src) {
  var cutter = /---- IF BROWSER, CUT ALONG LINE ----\n/;
  var srcStr = src.toString();
  var match = cutter.exec(srcStr);
  return srcStr.substr(match.index + match[0].length);
}

var randySrc = cut(fs.readFileSync(__dirname + '/lib/randy.js'));
var well1024aSrc = fs.readFileSync(__dirname + '/node_modules/prng-well1024a/browser/well1024a.js');

fs.writeFileSync(__dirname + '/browser/randy.js',
                 well1024aSrc + '\n' + randySrc);
