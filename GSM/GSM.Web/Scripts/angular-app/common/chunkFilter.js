var App;
(function (App) {
    var Common;
    (function (Common) {
        var Filters;
        (function (Filters) {
            var ChunkFilter = (function () {
                function ChunkFilter() {
                }
                ChunkFilter.filter = function () {
                    return function (items, size) {
                        //return items.filter((item, index) => {
                        //    return index % size === 0;
                        //});
                        var chunkedData = [];
                        for (var i = 0; i < items.length; i += size) {
                            chunkedData.push(items.slice(i, i + size));
                        }
                        return chunkedData;
                    };
                };
                return ChunkFilter;
            }());
            Filters.ChunkFilter = ChunkFilter;
            App.getAppContainer()
                .getSection('common')
                .getInstance()
                .filter('chunk', ChunkFilter.filter);
        })(Filters = Common.Filters || (Common.Filters = {}));
    })(Common = App.Common || (App.Common = {}));
})(App || (App = {}));
//# sourceMappingURL=chunkFilter.js.map