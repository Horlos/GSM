var App;
(function (App) {
    var Common;
    (function (Common) {
        var DataProvider;
        (function (DataProvider) {
            (function (DataSourceType) {
                DataSourceType[DataSourceType["JQuery"] = 0] = "JQuery";
                DataSourceType[DataSourceType["Angular"] = 1] = "Angular";
            })(DataProvider.DataSourceType || (DataProvider.DataSourceType = {}));
            var DataSourceType = DataProvider.DataSourceType;
            var AngularDataSource = (function () {
                function AngularDataSource(url, $http) {
                    this.url = url;
                    this.$http = $http;
                }
                AngularDataSource.prototype.get = function (config) {
                    return this.$http.get(this.url, config);
                };
                AngularDataSource.prototype.head = function (config) {
                    return this.$http.head(this.url, config);
                };
                AngularDataSource.prototype.post = function (entity, config) {
                    return this.$http.post(this.url, entity, config);
                };
                AngularDataSource.prototype.put = function (entity, config) {
                    return this.$http.put(this.url, entity, config);
                };
                AngularDataSource.prototype.delete = function (config) {
                    return this.$http.delete(this.url, config);
                };
                AngularDataSource.prototype.patch = function (entity, config) {
                    return this.$http.patch(this.url, entity, config);
                };
                return AngularDataSource;
            }());
            DataProvider.AngularDataSource = AngularDataSource;
            var JQueryDataSource = (function () {
                function JQueryDataSource(url) {
                    this.url = url;
                }
                JQueryDataSource.prototype.get = function (config) {
                    return $.get(this.url);
                };
                JQueryDataSource.prototype.head = function (config) {
                    return $.ajax({
                        type: 'HEAD',
                        async: true,
                        url: this.url
                    });
                };
                JQueryDataSource.prototype.post = function (entity, config) {
                    return $.post(this.url, entity);
                };
                JQueryDataSource.prototype.put = function (entity, config) {
                    return $.ajax({
                        type: 'PUT',
                        async: true,
                        url: this.url
                    });
                };
                JQueryDataSource.prototype.delete = function (config) {
                    return $.ajax({
                        type: 'DELETE',
                        async: true,
                        url: this.url
                    });
                };
                JQueryDataSource.prototype.patch = function (entity, config) {
                    return $.ajax({
                        type: 'PATCH',
                        async: true,
                        url: this.url
                    });
                };
                return JQueryDataSource;
            }());
            DataProvider.JQueryDataSource = JQueryDataSource;
        })(DataProvider = Common.DataProvider || (Common.DataProvider = {}));
    })(Common = App.Common || (App.Common = {}));
})(App || (App = {}));
//# sourceMappingURL=dataProvider.js.map