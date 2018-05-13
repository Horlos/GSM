var App;
(function (App) {
    var Common;
    (function (Common) {
        var Utils = (function () {
            function Utils() {
            }
            Utils.lastUrlParam = function (url) {
                var urlAsArray = url.split('/');
                return urlAsArray[urlAsArray.length - 1];
            };
            Utils.searchFor = function (array, searchProperty, searchVal) {
                var result = null;
                $.each(array, function (index) {
                    if (array[index][searchProperty] === searchVal) {
                        result = array[index];
                    }
                });
                return result;
            };
            Utils.findAndRemove = function (array, item) {
                $.each(array, function (index, result) {
                    if (result == item) {
                        array.splice(index, 1);
                    }
                });
            };
            Utils.addRange = function (array, arrayToAdd) {
                $.each(arrayToAdd, function (index, result) {
                    array.push(result);
                });
            };
            return Utils;
        }());
        Common.Utils = Utils;
    })(Common = App.Common || (App.Common = {}));
})(App || (App = {}));
//# sourceMappingURL=utils.js.map