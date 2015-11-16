/* */ 
var g,
    ua,
    p,
    assert = require('assert'),
    browser = require('../src/bowser'),
    allUserAgents = require('../src/useragents').useragents;
function objLength(obj) {
  var size = 0,
      key;
  for (key in obj) {
    if (obj.hasOwnProperty(key))
      size++;
  }
  return size;
}
function objKeys(obj) {
  var keys = [],
      key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      keys.push(key);
    }
  }
  keys.sort();
  return keys.join(', ');
}
for (g in allUserAgents) {
  (function(group, userAgents) {
    describe(group, function() {
      for (ua in userAgents) {
        (function(userAgent, expections) {
          describe('user agent "' + userAgent + '"', function() {
            expections.name = group;
            var result = browser._detect(userAgent);
            it('should have ' + objLength(expections) + ' properties', function() {
              assert.equal(objKeys(result), objKeys(expections));
            });
            for (p in expections) {
              (function(property, value, resultValue) {
                it('\'s Property "' + property + '" should be ' + value, function() {
                  assert.equal(resultValue, value);
                });
              })(p, expections[p], result[p]);
            }
          });
        })(ua, userAgents[ua]);
      }
    });
  })(g, allUserAgents[g]);
}
