function getLCS(a, b) {
    var m = a.length, n = b.length,
        C = [], i, j;
    for (i = 0; i <= m; i++) C.push([0]);
    for (j = 0; j < n; j++) C[0].push(0);
    for (i = 0; i < m; i++)
        for (j = 0; j < n; j++)
            C[i+1][j+1] = a[i] === b[j] ? C[i][j]+1 : Math.max(C[i+1][j], C[i][j+1]);
    return (function bt(i, j) {
        if (i*j === 0) { return ""; }
        if (a[i-1] === b[j-1]) { return bt(i-1, j-1) + a[i-1]; }
        return (C[i][j-1] > C[i-1][j]) ? bt(i, j-1) : bt(i-1, j);
    }(m, n));
}

function spellCheck(input, solution) {
    var are_equal = input == solution;
    if (!are_equal) {
        var diff = "";
        var del = "";
        while (input.length > 0) {
            var lcs = getLCS(input, solution);
            if (lcs.length == 0) {
                del += input[0];
            } else {
                diff += "<span class='spell_del'>" + del + "</span>";
                input.slice(lcs.length);
                del = "";
            }
        }
    }
    return {
        are_equal: are_equal,
    };
}

// Returns the edit distance between two strings.
function editDistance(s1, s2) {
    // Create a two dimensional array (array of arrays) with n rows and m
    // columns.
    function new2DArray(n, m) {
        var arr = new Array(n);
        for (var i = 0; i < n; i++) {
            arr[i] = new Array(m);
        }
        return arr;
    }

    var d = new2DArray(s1.length + 1, s2.length + 1);
    for (var i = 0; i <= s1.length; i++) {
        d[i][0] = i;
    }
    for (var j = 0; j <= s2.length; j++) {
        d[0][j] = j;
    }
    for (var i = 1; i <= s1.length; i++) {
        for (var j = 1; j <= s2.length; j++) {
            var cost = s1[i-1] != s2[j-1];
            d[i][j] = Math.min(
                d[i-1][j] + 1,
                d[i][j-1] + 1,
                d[i-1][j-1] + cost);
            if (i > 1 && j > 1 && s1[i-1] == s2[j-2] && s1[i-2] == s2[j-1]) {
                d[i][j] = Math.min(
                    d[i][j],
                    d[i-2][j-2] + cost);
            }
        }
    }
    return d[s1.length][s2.length];
}
