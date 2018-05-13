var App;
(function (App_1) {
    var Framework;
    (function (Framework) {
        var App = (function () {
            function App() {
                this.sectionsContainer = [];
            }
            App.prototype.addSection = function (section, isRoot) {
                this.sectionsContainer.push(section);
                if (isRoot) {
                    this.rootSection = section;
                    section.register();
                }
                else {
                    section.register(this.rootSection.name);
                }
            };
            App.prototype.getSection = function (sectionName) {
                for (var i = 0; i < this.sectionsContainer.length; i++) {
                    if (this.sectionsContainer[i].name === sectionName) {
                        return this.sectionsContainer[i];
                    }
                }
                throw new Error('There is no section ' + sectionName + ' registered in application container');
            };
            App.prototype.getRootSection = function () {
                return this.rootSection;
            };
            App.prototype.bootstrap = function (callback) {
                callback();
            };
            return App;
        }());
        Framework.App = App;
    })(Framework = App_1.Framework || (App_1.Framework = {}));
})(App || (App = {}));
//# sourceMappingURL=appBase.js.map