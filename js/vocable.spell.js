function _array2d(n, m) {
  var arr = new Array(n);
  for (var i = 0; i < n; i++) {
    arr[i] = new Array(m);
  }
  return arr;
}

function _min() {
  var min = arguments[0];
  for (var i = 1; i < arguments.length; i++) {
    var arg = arguments[i];
    min = arg < min ? arg : min;
  }
  return min;
}

function _editDistance(s1, s2) {
  var d = _array2d(s1.length + 1, s2.length + 1);
  for (var i = 0; i <= s1.length; i++) {
    d[i][0] = i;
  }
  for (var j = 0; j <= s2.length; j++) {
    d[0][j] = j;
  }
  for (var i = 1; i <= s1.length; i++) {
    for (var j = 1; j <= s2.length; j++) {
      var cost = s1[i-1] != s2[j-1];
      d[i][j] = _min(
        d[i-1][j] + 1,
        d[i][j-1] + 1,
        d[i-1][j-1] + cost);
      if (i > 1 && j > 1 && s1[i-1] == s2[j-2] && s1[i-2] == s2[j-1]) {
        d[i][j] = _min(d[i][j], d[i-2][j-2] + cost);
      }
    }
  }
  return d[s1.length][s2.length];
}

function spellScore(input, correct) {
  return _editDistance(input, correct);
}
