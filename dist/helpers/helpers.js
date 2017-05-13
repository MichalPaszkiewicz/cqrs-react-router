"use strict";
exports.matchPath = function (pathHash, options) {
    var _a = options.exact, exact = _a === void 0 ? false : _a, path = options.path;
    var pathname = pathHash.substr(2);
    if (!pathname && path == "/") {
        return {
            path: path,
            url: path,
            isExact: true,
            id: null
        };
    }
    if (!path || path == "*") {
        return {
            path: null,
            url: pathname,
            isExact: false,
            id: null
        };
    }
    var testPath = path;
    var hasID = testPath.indexOf(":") > -1;
    var id = null;
    if (hasID) {
        testPath = path.substr(0, path.indexOf(":"));
        id = pathname.substr(path.indexOf(":"));
    }
    var match = new RegExp("^" + testPath).exec(pathname);
    if (!match)
        return null;
    var url = match[0];
    var isExact = pathname === url;
    if (exact && (!isExact && !hasID)) {
        return null;
    }
    return {
        path: path,
        url: url,
        isExact: isExact,
        id: id
    };
};
//# sourceMappingURL=helpers.js.map