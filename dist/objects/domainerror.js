"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var DomainError = (function (_super) {
    __extends(DomainError, _super);
    function DomainError(message) {
        var _this = _super.call(this, message) || this;
        _this.message = message;
        _this.name = "DomainError";
        _this.stack = new Error().stack;
        return _this;
    }
    return DomainError;
}(Error));
exports.DomainError = DomainError;
//# sourceMappingURL=domainerror.js.map