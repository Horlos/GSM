
var module = angular.module('rolesApp', ['ngResource', 'ngSanitize', 'ui.bootstrap']);

module.factory('rolesResource', ['$resource', function (resource) {
    return resource('../api/authorization/roles');
}]);

module.factory('permissionsResource', ['$resource', function (resource) {
    return resource('../api/authorization/permissions');
}]);

module.factory('usersResource', ['$resource', function (resource) {
    return resource('../api/authorization/users');
}]);

function AuthorizationService(rolesResource, permissionsResource, usersResource) {
    this.rolesResource = rolesResource;
    this.permissionsResource = permissionsResource;
    this.usersResource = usersResource;
    AuthorizationService.prototype.GetAllPermissions = function (onSuccess, onFailure) {
        var permissionsProxy = this.permissionsResource.query({});
        permissionsProxy.$promise.then(angular.bind(this, function (data) {
            if (permissionsProxy.$resolved) {
                onSuccess(data);
            }
            else {
                onFailure(data);
            }
        }));
    }

    AuthorizationService.prototype.GetAllRoles = function (onSuccess, onFailure) {
        var rolesProxy = this.rolesResource.query({});
        rolesProxy.$promise.then(angular.bind(this, function (data) {
            if (rolesProxy.$resolved) {
                onSuccess(data);
            }
            else {
                onFailure(data);
            }
        }));
    }

    AuthorizationService.prototype.SearchForUser = function (userName, onSuccess, onFailure) {
        var usersProxy = this.usersResource.get({userName: userName});
        usersProxy.$promise.then(angular.bind(this, function (data) {
            if (usersProxy.$resolved) {
                onSuccess(data);
            }
            else {
                onFailure(data);
            }
        }));
    }

    AuthorizationService.prototype.RemoveRole = function (roleToRemove, onSuccess, onFailure) {
        var rolesProxy = this.rolesResource.delete({ Id: roleToRemove.Id });
        rolesProxy.$promise.then(angular.bind(this, function (data) {
            if ( rolesProxy.$resolved)
            {
                (onSuccess == null || onSuccess(data));
            }
            else {
                (onFailure == null || onFailure(data));
            }
        }));
    };

    AuthorizationService.prototype.AddRole = function (newRole, onSuccess, onFailure) {
        var rolesProxy = this.rolesResource.save({ Name: newRole.roleName, ADGroupId: newRole.adGroupId});
        rolesProxy.$promise.then(angular.bind(this, function (data) {
            if (rolesProxy.$resolved) {
                (onSuccess == null || onSuccess(data));
            }
            else {
                (onFailure == null || onFailure(data));
            }
        }));
    }

    AuthorizationService.prototype.SavePermissions = function (id, newPermissions) {
        var permissionProxy = this.permissionsResource.save({ roleId: id }, newPermissions);
        permissionProxy.$promise.then(angular.bind(this, function (data) {
            if (rolesProxy.$resolved) {
                (onSuccess == null || onSuccess(data));
            }
            else {
                (onFailure == null || onFailure(data));
            }
        }));
    }

    AuthorizationService.prototype.SaveUsers = function (id, newUsers) {
        var usersProxy = this.usersResource.save({ roleId: id }, newUsers);
        usersProxy.$promise.then(angular.bind(this, function (data) {
            if (rolesProxy.$resolved) {
                (onSuccess == null || onSuccess(data));
            }
            else {
                (onFailure == null || onFailure(data));
            }
        }));
    }
}

module.directive('svRestrictWhen', function () {
    var directiveDefObject = {
        restrict: 'A',
        scope: {},
        link : function(scope, iElement, iAttrs, controller, transcludeFn)
        {
            var fnrestrict = scope.$parent.$eval(iAttrs.svRestrictWhen);
            scope.isRestricted = true;
            scope.$parent.$watch(iAttrs.ngModel, function (a) {
                iElement.attr('disabled', fnrestrict(a));
            });
        },
    };
    return directiveDefObject;
});

module.service('authorizationService', ['rolesResource', 'permissionsResource', 'usersResource', AuthorizationService]);

module.controller('yesNoController', function ($scope, $modalInstance) {
    $scope.ok = function () {
        $modalInstance.close();
    };

    $scope.cancel = function () {
        $modalInstance.dismiss();
    };
});

module.controller('addRoleController', function ($scope, $modalInstance) {
    $scope.newRoleName = '';
    $scope.ok = function () {
        $modalInstance.close({ roleName: $scope.newRoleName });
    };

    $scope.cancel = function () {
        $modalInstance.dismiss();
    };
});

module.controller('addUserController', function ($scope, $modalInstance) {
    $scope.newUserName = '';
    $scope.ok = function () {
        $scope.authSvc.SearchForUser($scope.newUserName, function (data) {
            if (data.Name != undefined) {
                $modalInstance.close({ userName: $scope.newUserName });
            } else {
                $scope.message = 'User not located...';
            }
        });
    };

    $scope.$watch('newUserName', function (a, b) {
        ($scope.message.length > 0 && $scope.userNameChanged());
    }, true);

    $scope.userNameChanged = function () {
        $scope.message = '';
    };
    $scope.cancel = function () {
        $modalInstance.dismiss();
    };
});

module.controller('rolesController', ['$q', '$scope', 'authorizationService', '$uibModal', function ($q, $scope, authSvc, $uibModal) {
    $scope.roles = [];
    $scope.rows = [];
    $scope.selectedRole = {};
    $scope.selectedUser = {};
    $scope.authSvc = authSvc;

    $scope.$watch('selectedRole.Id', function (a, b) {
        (angular.isDefined(a) && $scope.selectedRoleChanged());
    }, true);

    $scope.$watch('selectedUser.Name', function (a, b) {
        (angular.isDefined(a) && $scope.selectedUserChanged());
    }, true);
            
    $scope.UpdateRoles = function()
    {
        $scope.authSvc.GetAllRoles(function (data) {
            $scope.roles = data;
            angular.copy($scope.roles[0], $scope.selectedRole);
        });
    }

    $scope.nameAlreadyInUse = function (name) {
        var result = name == null || name.length == 0 || $scope.roles.map(function (item) { return item.Name.toLowerCase(); }).indexOf(name.toLowerCase()) != -1;
        return result;
    };

    $scope.userNameAlreadyInUse = function (name) {
        var result = name == null || name.length == 0 || $scope.selectedRole.Users.map(function (item) { return item.Name.toLowerCase(); }).indexOf(name.toLowerCase()) != -1;
        return result;
    };

    $scope.selectedRoleChanged = function () {
        $scope.rows.length = 0;
        for (var i = 0; i < $scope.selectedRole.Permissions.length; i++) {
            var index = Math.floor(i / 3);
            if ($scope.rows[index] == null ) {
                $scope.rows[index] = [];
            };
            $scope.rows[index].push($scope.selectedRole.Permissions[i]);
        };
        angular.copy($scope.selectedRole.Users[0], $scope.selectedUser);
        $scope.permissionsForm.$setPristine();
    }

    $scope.cancelChanges = function () {
        var idx = $scope.roles.map(function (item) { return item.Id; }).indexOf($scope.selectedRole.Id);
        angular.copy($scope.roles[idx], $scope.selectedRole);
        $scope.selectedRoleChanged();
    };

    $scope.removeRole = function () {
        var mboxScope = $scope.$new(true);
        angular.extend(mboxScope, { title: 'Remove Role', message: 'Are you sure you want to remove this role ?', yesOption: 'Yes', cancelOption: 'Cancel' });
        var modalInstance = $uibModal.open({ templateUrl: 'confirmDialog.html', controller: 'yesNoController', scope: mboxScope });
        modalInstance.result.then(function (modelResult) {
            $scope.authSvc.RemoveRole($scope.selectedRole, function () {
                $scope.UpdateRoles();
            });
        });
    }

    $scope.removeUser = function () {
        for (var i = 0, len = $scope.selectedRole.Users.length; i < len; i++) {
            if ($scope.selectedRole.Users[i].Name == $scope.selectedUser.Name) {
                index = i;
                break;
            }
        }
        $scope.selectedRole.Users.splice(index, 1);
        angular.copy($scope.selectedRole.Users[0], $scope.selectedUser);
        $scope.permissionsForm.$dirty = true;
    }

    $scope.permitRemoveUser = function () {
        return $scope.selectedRole.Users == undefined || $scope.selectedRole.Users.length > 0;
    }

    $scope.addRole = function () {
        var modalInstance = $uibModal.open({ templateUrl: 'addRoleDialog.html', controller: 'addRoleController', scope: $scope, size: 'sm' });
        modalInstance.result.then(function (modelResult) {
            $scope.authSvc.AddRole(modelResult, function () {
                $scope.UpdateRoles();
            });
        });
    };

    $scope.addUser = function () {
        var modalInstance = $uibModal.open({ templateUrl: 'addUserDialog.html', controller: 'addUserController', scope: $scope, size: 'sm' });
        modalInstance.result.then(function (modelResult) {
            $scope.selectedRole.Users.push({ Name: modelResult.userName })
            if ($scope.selectedUser == null || $scope.selectedUser.Name == undefined) {
                angular.copy($scope.selectedRole.Users[0], $scope.selectedUser)
            }
            $scope.permissionsForm.$dirty = true;
        });
    };

    $scope.submit = function () {
        var newPermssions = [];
        angular.forEach($scope.selectedRole.Permissions, function (item) {
            newPermssions.push({ Permission: item.Permission, Enabled: item.Enabled, Name: item.Name });
        });
        $scope.authSvc.SavePermissions($scope.selectedRole.Id, newPermssions);
        $scope.authSvc.SaveUsers($scope.selectedRole.Id, $scope.selectedRole.Users);
        var idx = $scope.roles.map(function (item) { return item.Id; }).indexOf($scope.selectedRole.Id);
        angular.copy($scope.selectedRole, $scope.roles[idx]);
        $scope.permissionsForm.$setPristine();
    };

    $scope.UpdateRoles();
}]);
