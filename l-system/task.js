var that = this;

that.addEventListener('message', function(e) {
  var start = e.data.start,
      iteration = e.data.iterations,
      ruleX = e.data.ruleX,
      ruleY = e.data.ruleY,
      ruleF = e.data.ruleF;

  var replace = function(str, level) {
    var c, newStr = '';

    if(str == '') {
      return;
    }

    for(var j = 0; j < str.length; j ++) {
      c = str[j];

      if(c == 'X') {
        newStr += ruleX;
      } else if(c == 'Y') {
        newStr += ruleY;
      } else if(c == 'F') {
        newStr += ruleF;
      } else {
        newStr += c;
      }
    }

    if(level === 0) {
      that.postMessage({
        start: newStr
      });
    } else {
      var chunk;
      
      while((chunk = newStr.slice(0, 1000)).length > 0) {
        replace(chunk, level - 1);
        newStr = newStr.slice(1000, newStr.length);
      }
    }
  };

  replace(start, Math.max(0, iteration - 1));
}, false);

