var fs = require("fs");
const vm = require('vm');

var exports = module.exports = {};

// split code in chunks of type "node" or "plain" and return them into an array
function chunkify(tplStr)
{
	var chunkArray = [];
	var tplStrCons = tplStr;
	while(tplStrCons.length)
	{
		var nextJsChunkIndexStart = tplStrCons.indexOf("<?node");
		var codeEndIndex = 0;
		var codeType = "";
		if(nextJsChunkIndexStart === 0) // is node chunk
		{
			codeType = "node";
			tplStrCons = tplStrCons.substring("<?node".length, tplStr.length);
			codeEndIndex = tplStrCons.indexOf("?>");
			if(codeEndIndex == -1)
			{
				console.log("non closed tag");
				break;
			}
			if(codeEndIndex < nextJsChunkIndexStart)
			{
				console.log("closing tag before opening!");
				break;
			}
			tplStrCons = tplStrCons.substring(0, codeEndIndex) +
						 tplStrCons.substring(codeEndIndex + "?>".length, tplStrCons.length);
		}
		else
		{
			codeType = "plain";
			codeEndIndex = (nextJsChunkIndexStart > -1)? nextJsChunkIndexStart : tplStrCons.length;
		}
		chunkArray.push({
			type: codeType,
			code: tplStrCons.substring(0, codeEndIndex)
		});
		tplStrCons = tplStrCons.substring(codeEndIndex, tplStrCons.length);
	}
	return chunkArray;
}

function renderOutput(chunkArray, globals)
{
	var jsCodeStr = "";
	for(var i = 0; i < chunkArray.length; i++)
	{
		if(chunkArray[i].type == "plain")
			jsCodeStr += " nte._chunkEnd(); ";
		if(chunkArray[i].type == "node")
			jsCodeStr += chunkArray[i].code + " nte._chunkEnd(); ";
	}
	
	var output = "";
	
	// begin section: global APIs
	
	var buffer = "";
	globals.echo = function(newBuf) { buffer += newBuf; };
	
	// end section: global APIs
	
	// begin section: nte APIs
	
	globals.nte = {};
	
	var currentChunk = 0;
	globals.nte._chunkEnd = function() {
		if(chunkArray[currentChunk].type == "plain")
			buffer = chunkArray[currentChunk].code;
		output += buffer;
		buffer = "";
		currentChunk++;
	};
	
	// end section: nte APIs
	
	vm.createContext(globals);
	vm.runInContext(jsCodeStr, globals);
	
	return output;
}

var parse = function(tplStr, globals){
	var chunkArray = chunkify(tplStr);
	return renderOutput(chunkArray, globals);
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