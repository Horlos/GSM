"use strict";
var MaterialRequestResource = (function () {
    function MaterialRequestResource($resource) {
        this.$resource = $resource;
        this.resource = $resource('api/materialrequest');
    }
    MaterialRequestResource.$inject = [
        '$resource'
    ];
    return MaterialRequestResource;
}());
exports.MaterialRequestResource = MaterialRequestResource;
//# sourceMappingURL=material-request.resource.js.map