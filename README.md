# NTE

A super simple, easily extensible and inspirational template engine for Node.js!

NTE stands for Node.js Template Engine.

Features:
* parse templates thanks to vm.runInContext
* bidirectional data communication
* light footprint (the code is only 36 lines!)
* **coming soon** allow to choose between
  ```js
  vm.runInContext(code, contextifiedSandbox[, options])
  vm.runInDebugContext(code)
  vm.runInNewContext(code[, sandbox][, options])
  vm.runInThisContext(code[, options])
  ```
  (now it relies only upon runInContext)

## Installation
  ```js
  npm install nte --save
  ```

## Usage
  **Server code (server.js)**
  ```js
  // initialization code
  var express = require('express');
  var app = express();
  var jtl = require("jtl");
  
  // if you want express support
  jtl.linkExpress(app, "public");

  // ... your code ...
  
  // without express
  var myTpl = nte.renderFile(__dirname + "/public/myTpl.nte", {username: "john.doe"});
  res.end(myTpl);
  
  // or with express
  res.render('myTpl', {username: "john.doe"});
  
  // ... your code ...
  ```
  
  **Template Code (myTpl.nte)**
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

* 1.0.0 Initial release
