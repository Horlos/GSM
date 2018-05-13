function SelectedColumn(columnName) {
    this.Name = columnName;
    this.Selected = true;
};

function UserSettings() {
    this.compoundsearch = {
        selectedColumns: [], columnDisplayOrder: []
    }
};

angular.module("userSettings", ["ngResource"])
.factory('userSettingsAPI', ['$resource', function userSettingsAPIFactory($resource){
        return $resource('/api/usersettings');
}])
.controller("userSettingsController", ['$scope', 'userSettingsAPI', function ($scope, userSettingsAPI) {
    var self = this;
    this.api = userSettingsAPI;
    $scope.model = new UserSettings();
    $scope.SelectedColumns = [];
    $scope.ColumnDisplayOrder = [];

    this.getSettings = function () {
        self.api.get({}, self.onDataReceived);
    };
    
    this.saveSettings = function () {
        self.api.save();
    }    

    this.onDataReceived = function (data) {
        // update the model
        $scope.model.compoundsearch.selectedColumns.length = 0;
        angular.extend($scope.model, data);

        // update the viewmodel/scope
        $scope.SelectedColumns.length = 0;
        angular.forEach($scope.model.compoundsearch.selectedColumns,
            function(item) {
                $scope.SelectedColumns.push(new SelectedColumn(item));
            });
    };
}]);