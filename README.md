# NTE

A super simple, easily extensible and inspirational template engine for Node.js!

NTE stands for Node.js Template Engine.

Features:
* parse templates thanks to vm.runInContext
* bidirectional data communication
* light footprint (the code is only 109 lines!)
* **coming soon** allow to choose between
```js
  vm.runInContext(code, contextifiedSandbox[, options])
  vm.runInDebugContext(code)
  vm.runInNewContext(code[, sandbox][, options])
  vm.runInThisContext(code[, options])
```
  (now it relies only upon runInContext)
* **coming soon** include directives

## Installation
  ```js
  npm install nte --save
  ```
## APIs

  **Node**
```js
  nte.linkExpress(expressObject, templatesFolder)
```
  link express to NTE to deliver compiled tempaltes
```js
  nte.renderFile(filePath, globals);
```
  take the specified file and compile it using the variables passed with the "globals" parameter
  
  **Template**
  
```js
  echo(string)
```
  print some text to the output buffer.

## Usage
  **Server code (/server.js)**
  ```js
  // initialization code
  var express = require('express');
  var app = express();
  var nte = require("nte");
  
  // if you want express support:
  // nte.linkExpress(expressObject, templatesFolder);
  nte.linkExpress(app, "public");
  
  // serve as string
  app.get('/NTEPlain', function (req, res) {
      var myTpl = nte.renderFile(__dirname + "/public/myTpl.nte", {username: "john.doe"});
      res.end(myTpl);
  });
  
  // serve with express
  app.get('/NTEExpress', function (req, res) {
      res.render('myTpl', {username: "john.doe"});
  });
  
  // *** LISTENING ***
  var server = app.listen(8081, function () {
  	var host = server.address().address;
  	var port = server.address().port;
  	console.log("Listening at http://%s:%s", host, port);
  });
  ```
  
  **Template Code (/public/myTpl.nte)**
  ```html
  <!doctype html>
  <html>
  <head>
	<title>hello world</title>
  </head>
  <body>
  	<?node var foo = 2; foo; echo(" " + (foo++) + " "); foo++; echo(foo); ?>
  	hello <?node echo(username); ?>!
  	<?node echo(foo); ?>
  </body>
  </html>
  ```

## Release History

* 1.1.0 Performance improvements:
	* Not using regex for parsing anymore saving performance on PREG overhead. Simple string checks are now performed.
	  I know this could lead to parsing problem in some cases but if you know what you're doing this worth it. 
	* All the js code is now squashed together and executed at once reducing overhead on the VM calls!
* 1.0.0 Initial release
