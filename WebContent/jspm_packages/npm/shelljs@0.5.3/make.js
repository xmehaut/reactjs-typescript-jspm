/* */ 
(function(process) {
  require('./global');
  global.config.fatal = true;
  global.target = {};
  var args = process.argv.slice(2),
      targetArgs,
      dashesLoc = args.indexOf('--');
  if (dashesLoc > -1) {
    targetArgs = args.slice(dashesLoc + 1, args.length);
    args = args.slice(0, dashesLoc);
  }
  setTimeout(function() {
    var t;
    if (args.length === 1 && args[0] === '--help') {
      console.log('Available targets:');
      for (t in global.target)
        console.log('  ' + t);
      return;
    }
    for (t in global.target) {
      (function(t, oldTarget) {
        global.target[t] = function() {
          if (oldTarget.done)
            return;
          oldTarget.done = true;
          return oldTarget.apply(oldTarget, arguments);
        };
      })(t, global.target[t]);
    }
    if (args.length > 0) {
      args.forEach(function(arg) {
        if (arg in global.target)
          global.target[arg](targetArgs);
        else {
          console.log('no such target: ' + arg);
        }
      });
    } else if ('all' in global.target) {
      global.target.all(targetArgs);
    }
  }, 0);
})(require('process'));
