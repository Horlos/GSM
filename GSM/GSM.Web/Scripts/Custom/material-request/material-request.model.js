"use strict";
var MaterialRequestModel = (function () {
    /**
     * Crete MaterialRequestModel instance from input object
     * @param obj
     */
    function MaterialRequestModel(obj) {
        var _this = this;
        Object.keys(obj).forEach(function (prop) { return _this[prop] = obj[prop]; });
    }
    return MaterialRequestModel;
}());
exports.MaterialRequestModel = MaterialRequestModel;
//# sourceMappingURL=material-request.model.js.map