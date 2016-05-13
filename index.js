var fs = require("fs");
const vm = require('vm');

var exports = module.exports = {};

var parse = function(tplStr, globals){
	var buffer = "";
	globals.echo = function(newBuf) { buffer += newBuf; };
	var sandbox = globals;
	vm.createContext(sandbox);

	var result = tplStr.replace(/<\?node(.*?)\?>/g, function(match, $1, offset, original) {
		buffer = "";
		vm.runInContext($1, sandbox);
		return buffer;
	});
	
	return result;
};

exports.renderFile = function(filePath, options) {
	var content = fs.readFileSync(filePath);
	return parse(content.toString(), options);
};

exports.linkExpress = function(app, viewsDir) {
	app.engine('nte', function (filePath, options, callback) {
		fs.readFile(filePath, function (err, content) {
			if (err) return callback(new Error(err));
			var result = parse(content.toString(), options);
			return callback(null, result);
		});
	});
	app.set('view engine', 'nte');
	app.set('views', viewsDir);
};