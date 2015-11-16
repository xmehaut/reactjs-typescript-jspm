/* */ 
var shell = require('./shell');
for (var cmd in shell)
  global[cmd] = shell[cmd];
