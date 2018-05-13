var App;
(function (App) {
    var Manage;
    (function (Manage) {
        var Controllers;
        (function (Controllers) {
            var ManageRolesCtrl = (function () {
                function ManageRolesCtrl($scope, $q, $uibModal, authorizationService, toastService) {
                    this.$scope = $scope;
                    this.$q = $q;
                    this.$uibModal = $uibModal;
                    this.authorizationService = authorizationService;
                    this.toastService = toastService;
                    this.initialize();
                    this.getPermissions();
                    this.loadRoles();
                    this.toastr = this.toastService.getToastServiceInstance();
                }
                ManageRolesCtrl.prototype.initialize = function () {
                    this.roles = [];
                    this.permissions = [];
                    this.selectedRole = {};
                    this.selectedUser = {};
                };
                ManageRolesCtrl.prototype.getPermissions = function () {
                    var _this = this;
                    this.authorizationService.getAllPermissions()
                        .then(function (data) {
                        _this.permissions = data;
                        _this.rows = _this.chunkData(_this.permissions, 3);
                    });
                };
                ManageRolesCtrl.prototype.loadRoles = function () {
                    var _this = this;
                    this.authorizationService.getAllRoles()
                        .then(function (data) {
                        _this.roles = data;
                        angular.copy(_this.roles[_this.roles.length - 1], _this.selectedRole);
                        _this.loadRoleUsers();
                    });
                };
                ManageRolesCtrl.prototype.loadRoleUsers = function () {
                    var _this = this;
                    var roleId = this.selectedRole.Id;
                    this.authorizationService.getRoleUsers(roleId)
                        .then(function (data) {
                        _this.selectedRole.Users = data;
                        _this.selectedUser = _this.selectedRole.Users[0] || {};
                    });
                };
                ManageRolesCtrl.prototype.chunkData = function (items, size) {
                    var chunkedData = [];
                    for (var i = 0; i < items.length; i += size) {
                        chunkedData.push(items.slice(i, i + size));
                    }
                    return chunkedData;
                };
                ManageRolesCtrl.prototype.selectedRoleChanged = function () {
                    this.selectedRole.Users = [];
                    this.loadRoleUsers();
                    this.$scope.form.$setPristine();
                };
                ManageRolesCtrl.prototype.selectedUserChanged = function () {
                };
                ManageRolesCtrl.prototype.isPermissionSelected = function (permissionId) {
                    var permissions = this.selectedRole.Permissions;
                    if (angular.isUndefined(permissions))
                        return false;
                    return App.Common.Utils.searchFor(permissions, "PermissionId", permissionId) != null;
                };
                ManageRolesCtrl.prototype.permissionSelected = function (permission) {
                    var permissionsCount = this.selectedRole.Permissions.length;
                    var permissions = this.selectedRole.Permissions.filter(function (item) {
                        return item.PermissionId !== permission.Id;
                    });
                    if (permissions.length !== permissionsCount) {
                        this.selectedRole.Permissions = permissions;
                    }
                    else {
                        this.selectedRole.Permissions.push({
                            PermissionId: permission.Id,
                            RoleId: this.selectedRole.Id
                        });
                    }
                    this.$scope.form.$setDirty();
                };
                ManageRolesCtrl.prototype.isUserExists = function (userName) {
                    var defer = this.$q.defer();
                    if (userName == null || userName.length === 0) {
                        defer.resolve(false);
                    }
                    else {
                        defer.resolve(this.authorizationService.searchForUser(userName)
                            .then(function (data) {
                            return data && data.Name;
                        })
                            .catch(function (error) {
                            return false;
                        }));
                    }
                    return defer.promise;
                };
                ManageRolesCtrl.prototype.isRoleNameNotExists = function (roleName) {
                    var defer = this.$q.defer();
                    if (roleName == null || roleName.length === 0) {
                        defer.resolve(false);
                    }
                    else {
                        var result = this.roles.map(function (role) {
                            return role.Name.toLowerCase();
                        });
                        defer.resolve(result.indexOf(roleName.toLowerCase()) === -1);
                    }
                    return defer.promise;
                };
                ManageRolesCtrl.prototype.permitRemoveRole = function () {
                    return angular.isUndefined(this.selectedRole.Users) || this.selectedRole.Users == null || this.selectedRole.Users.length > 0;
                };
                ManageRolesCtrl.prototype.permitRemoveUser = function () {
                    return true;
                };
                ManageRolesCtrl.prototype.isRolesControlsDisabled = function () {
                    return this.$scope.form.$dirty;
                };
                ManageRolesCtrl.prototype.permitSubmit = function () {
                    return this.$scope.form.$dirty;
                };
                ManageRolesCtrl.prototype.onSubmit = function () {
                };
                ManageRolesCtrl.prototype.submit = function () {
                    var _this = this;
                    var role = {
                        Id: this.selectedRole.Id,
                        Name: this.selectedRole.Name,
                        Permissions: this.selectedRole.Permissions,
                        Users: []
                    };
                    role.Users = this.selectedRole.Users.map(function (user) {
                        return { UserId: user.Id, RoleId: role.Id };
                    });
                    this.authorizationService.updateRole(role.Id, role)
                        .then(function (data) {
                        _this.toastr.showToast("Role " + role.Name + " was successfully updated.", App.Common.Ui.Toaster.ToastType.Success, App.Common.Ui.Toaster.ToastPosition.BottomRight);
                        var index = _this.roles.map(function (role) { return role.Id; }).indexOf(_this.selectedRole.Id);
                        angular.copy(_this.selectedRole, _this.roles[index]);
                        _this.$scope.form.$setPristine();
                    });
                };
                ManageRolesCtrl.prototype.permitCancel = function () {
                    return this.$scope.form.$dirty;
                };
                ManageRolesCtrl.prototype.cancelChanges = function () {
                    var index = this.roles.map(function (role) { return role.Id; }).indexOf(this.selectedRole.Id);
                    angular.copy(this.roles[index], this.selectedRole);
                    this.selectedRoleChanged();
                };
                ManageRolesCtrl.prototype.addRole = function () {
                    var _this = this;
                    var modalSettings = {
                        templateUrl: '/Scripts/angular-app/widgets/inputModal.html',
                        controller: 'InputModalCtrl',
                        controllerAs: 'vm',
                        size: 'sm',
                        resolve: {
                            inputModalConfig: function () {
                                return {
                                    validationMessage: function (model) { return 'Role with this name already exists'; },
                                    title: 'Add Role',
                                    confirmEnabledCondition: function (model) {
                                        return _this.isRoleNameNotExists(model);
                                    }
                                };
                            }
                        }
                    };
                    var modalInstance = this.$uibModal.open(modalSettings);
                    modalInstance.result.then(function (result) {
                        if (result) {
                            var role = { Name: result };
                            _this.authorizationService.addRole(role)
                                .then(function (data) {
                                _this.loadRoles();
                            });
                        }
                    });
                };
                ManageRolesCtrl.prototype.addUser = function () {
                    var _this = this;
                    var modalSettings = {
                        templateUrl: '/Scripts/angular-app/widgets/inputModal.html',
                        controller: 'InputModalCtrl',
                        controllerAs: 'vm',
                        size: 'sm',
                        resolve: {
                            inputModalConfig: function () {
                                return {
                                    validationMessage: function (model) { return "User " + model + " not found by the domain controller."; },
                                    title: 'Add User',
                                    confirmEnabledCondition: function (model) {
                                        return _this.isUserExists(model);
                                    }
                                };
                            }
                        }
                    };
                    var modalInstance = this.$uibModal.open(modalSettings);
                    modalInstance.result.then(function (result) {
                        if (result) {
                            var users_1 = _this.selectedRole.Users;
                            var isUserAdded = users_1.some(function (user) { return user.Name === result; });
                            if (!isUserAdded) {
                                _this.authorizationService.addUser({ Name: result })
                                    .then(function (data) {
                                    _this.selectedRole.Users.push(data);
                                    if (_this.selectedUser == null || angular.isUndefined(_this.selectedUser.Name)) {
                                        angular.copy(users_1[users_1.length - 1], _this.selectedUser);
                                    }
                                    _this.$scope.form.$dirty = true;
                                });
                            }
                            else {
                                _this.toastr.showToast("User " + result + " already added to " + _this.selectedRole.Name + " role.", App.Common.Ui.Toaster.ToastType.Info, App.Common.Ui.Toaster.ToastPosition.BottomRight);
                            }
                        }
                    });
                };
                ManageRolesCtrl.prototype.removeRole = function () {
                    var _this = this;
                    var config = {
                        templateUrl: '/Scripts/angular-app/widgets/confirmationModal.html',
                        controller: 'ConfirmModalCtrl',
                        controllerAs: 'vm',
                        size: 'sm',
                        resolve: {
                            confirmModalConfig: function () {
                                return {
                                    confirmationMessage: 'Are you sure you want to remove this role?',
                                    title: 'Remove Role'
                                };
                            }
                        }
                    };
                    var modalInstance = this.$uibModal.open(config);
                    modalInstance.result.then(function (result) {
                        if (result === 'ok') {
                            _this.authorizationService.removeRole(_this.selectedRole.Id)
                                .then(function (data) {
                                if (data.StatusCode === 409) {
                                    _this.toastr
                                        .showToast("Role " + _this.selectedRole
                                        .Name + " can not be deleted because it associated with users.", App.Common.Ui.Toaster.ToastType.Error, App.Common.Ui.Toaster.ToastPosition.BottomRight);
                                }
                                else if (data.StatusCode !== 404) {
                                    _this.toastr.showToast("Role " + _this.selectedRole.Name + " was successfully deleted.", App.Common.Ui.Toaster.ToastType.Success, App.Common.Ui.Toaster.ToastPosition.BottomRight);
                                    _this.loadRoles();
                                }
                            });
                        }
                    });
                };
                ManageRolesCtrl.prototype.removeUser = function () {
                    var _this = this;
                    var config = {
                        templateUrl: '/Scripts/angular-app/widgets/confirmationModal.html',
                        controller: 'ConfirmModalCtrl',
                        controllerAs: 'vm',
                        size: 'sm',
                        resolve: {
                            confirmModalConfig: function () {
                                return {
                                    confirmationMessage: 'Are you sure you want to remove this user?',
                                    title: 'Remove User'
                                };
                            }
                        }
                    };
                    var modalInstance = this.$uibModal.open(config);
                    modalInstance.result.then(function (result) {
                        if (result === 'ok') {
                            for (var i = 0; i < _this.selectedRole.Users.length; i++) {
                                if (_this.selectedRole.Users[i].Name === _this.selectedUser.Name) {
                                    _this.selectedRole.Users.splice(i, 1);
                                    break;
                                }
                            }
                            _this.toastr.showToast("User " + _this.selectedUser.Name + " was successfully deleted from role " + _this.selectedRole.Name + ". Type save to apply changes.", App.Common.Ui.Toaster.ToastType.Success, App.Common.Ui.Toaster.ToastPosition.BottomRight);
                            angular.copy(_this.selectedRole.Users[0], _this.selectedUser);
                            _this.$scope.form.$dirty = true;
                        }
                    });
                };
                ManageRolesCtrl.$inject = ['$scope', '$q', '$uibModal', 'authorizationService', 'toastService'];
                return ManageRolesCtrl;
            }());
            App.getAppContainer()
                .getSection('app.manage')
                .getInstance()
                .controller('ManageRolesCtrl', ManageRolesCtrl);
        })(Controllers = Manage.Controllers || (Manage.Controllers = {}));
    })(Manage = App.Manage || (App.Manage = {}));
})(App || (App = {}));
//# sourceMappingURL=manageRolesCtrl.js.map