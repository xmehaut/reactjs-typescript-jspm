/* */ 
(function(process) {
  var common = require('./common');
  var _tempDir = require('./tempdir');
  var _pwd = require('./pwd');
  var path = require('path');
  var fs = require('fs');
  var child = require('child_process');
  function execSync(cmd, opts) {
    var tempDir = _tempDir();
    var stdoutFile = path.resolve(tempDir + '/' + common.randomFileName()),
        codeFile = path.resolve(tempDir + '/' + common.randomFileName()),
        scriptFile = path.resolve(tempDir + '/' + common.randomFileName()),
        sleepFile = path.resolve(tempDir + '/' + common.randomFileName());
    var options = common.extend({silent: common.config.silent}, opts);
    var previousStdoutContent = '';
    function updateStdout() {
      if (options.silent || !fs.existsSync(stdoutFile))
        return;
      var stdoutContent = fs.readFileSync(stdoutFile, 'utf8');
      if (stdoutContent.length <= previousStdoutContent.length)
        return;
      process.stdout.write(stdoutContent.substr(previousStdoutContent.length));
      previousStdoutContent = stdoutContent;
    }
    function escape(str) {
      return (str + '').replace(/([\\"'])/g, "\\$1").replace(/\0/g, "\\0");
    }
    if (fs.existsSync(scriptFile))
      common.unlinkSync(scriptFile);
    if (fs.existsSync(stdoutFile))
      common.unlinkSync(stdoutFile);
    if (fs.existsSync(codeFile))
      common.unlinkSync(codeFile);
    var execCommand = '"' + process.execPath + '" ' + scriptFile;
    var execOptions = {
      env: process.env,
      cwd: _pwd(),
      maxBuffer: 20 * 1024 * 1024
    };
    if (typeof child.execSync === 'function') {
      var script = ["var child = require('child_process')", "  , fs = require('fs');", "var childProcess = child.exec('" + escape(cmd) + "', {env: process.env, maxBuffer: 20*1024*1024}, function(err) {", "  fs.writeFileSync('" + escape(codeFile) + "', err ? err.code.toString() : '0');", "});", "var stdoutStream = fs.createWriteStream('" + escape(stdoutFile) + "');", "childProcess.stdout.pipe(stdoutStream, {end: false});", "childProcess.stderr.pipe(stdoutStream, {end: false});", "childProcess.stdout.pipe(process.stdout);", "childProcess.stderr.pipe(process.stderr);", "var stdoutEnded = false, stderrEnded = false;", "function tryClosing(){ if(stdoutEnded && stderrEnded){ stdoutStream.end(); } }", "childProcess.stdout.on('end', function(){ stdoutEnded = true; tryClosing(); });", "childProcess.stderr.on('end', function(){ stderrEnded = true; tryClosing(); });"].join('\n');
      fs.writeFileSync(scriptFile, script);
      if (options.silent) {
        execOptions.stdio = 'ignore';
      } else {
        execOptions.stdio = [0, 1, 2];
      }
      child.execSync(execCommand, execOptions);
    } else {
      cmd += ' > ' + stdoutFile + ' 2>&1';
      var script = ["var child = require('child_process')", "  , fs = require('fs');", "var childProcess = child.exec('" + escape(cmd) + "', {env: process.env, maxBuffer: 20*1024*1024}, function(err) {", "  fs.writeFileSync('" + escape(codeFile) + "', err ? err.code.toString() : '0');", "});"].join('\n');
      fs.writeFileSync(scriptFile, script);
      child.exec(execCommand, execOptions);
      while (!fs.existsSync(codeFile)) {
        updateStdout();
        fs.writeFileSync(sleepFile, 'a');
      }
      while (!fs.existsSync(stdoutFile)) {
        updateStdout();
        fs.writeFileSync(sleepFile, 'a');
      }
    }
    var code = parseInt('', 10);
    while (isNaN(code)) {
      code = parseInt(fs.readFileSync(codeFile, 'utf8'), 10);
    }
    var stdout = fs.readFileSync(stdoutFile, 'utf8');
    try {
      common.unlinkSync(scriptFile);
    } catch (e) {}
    try {
      common.unlinkSync(stdoutFile);
    } catch (e) {}
    try {
      common.unlinkSync(codeFile);
    } catch (e) {}
    try {
      common.unlinkSync(sleepFile);
    } catch (e) {}
    if (code === 1 || code === 2 || code >= 126) {
      common.error('', true);
    }
    var obj = {
      code: code,
      output: stdout
    };
    return obj;
  }
  function execAsync(cmd, opts, callback) {
    var output = '';
    var options = common.extend({silent: common.config.silent}, opts);
    var c = child.exec(cmd, {
      env: process.env,
      maxBuffer: 20 * 1024 * 1024
    }, function(err) {
      if (callback)
        callback(err ? err.code : 0, output);
    });
    c.stdout.on('data', function(data) {
      output += data;
      if (!options.silent)
        process.stdout.write(data);
    });
    c.stderr.on('data', function(data) {
      output += data;
      if (!options.silent)
        process.stdout.write(data);
    });
    return c;
  }
  function _exec(command, options, callback) {
    if (!command)
      common.error('must specify command');
    if (typeof options === 'function') {
      callback = options;
      options = {async: true};
    }
    if (typeof options === 'object' && typeof callback === 'function') {
      options.async = true;
    }
    options = common.extend({
      silent: common.config.silent,
      async: false
    }, options);
    if (options.async)
      return execAsync(command, options, callback);
    else
      return execSync(command, options);
  }
  module.exports = _exec;
})(require('process'));
