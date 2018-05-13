namespace App.Manage.Controllers {

    class ManageRolesCtrl {
        public roles: any[];
        public permissions: Array<any>;
        public users: Array<any>;
        public selectedRole: any;
        public selectedUser: any;
        private toastr: App.Common.Ui.Toaster.IToastServiceInstance;

        // TODO: Find the better way.
        public rows: Array<any>;

        static $inject = ['$scope', '$q', '$uibModal', 'authorizationService', 'toastService'];
        constructor(private $scope,
            private $q: ng.IQService,
            private $uibModal: ng.ui.bootstrap.IModalService,
            private authorizationService: App.Manage.Services.IAuthorizationService,
            private toastService: App.Common.Ui.Toaster.IToastService) {
            this.initialize();
            this.getPermissions();
            this.loadRoles();
            this.toastr = this.toastService.getToastServiceInstance();
        }

        initialize(): void {
            this.roles = [];
            this.permissions = [];
            this.selectedRole = {};
            this.selectedUser = {};
        }

        getPermissions(): void {
            this.authorizationService.getAllPermissions()
                .then((data) => {
                    this.permissions = data;
                    this.rows = this.chunkData(this.permissions, 3);
                });
        }

        loadRoles() {
            this.authorizationService.getAllRoles()
                .then((data) => {
                    this.roles = data;
                    angular.copy(this.roles[this.roles.length - 1], this.selectedRole);
                    this.loadRoleUsers();
                });
        }

        loadRoleUsers() {
            let roleId = this.selectedRole.Id;
            this.authorizationService.getRoleUsers(roleId)
                .then((data) => {
                    this.selectedRole.Users = data;
                    this.selectedUser = this.selectedRole.Users[0] || {};
                });
        }

        chunkData(items: Array<any>, size: number) {
            let chunkedData = [];
            for (let i = 0; i < items.length; i += size) {
                chunkedData.push(items.slice(i, i + size));
            }
            return chunkedData;
        }

        selectedRoleChanged(): void {
            this.selectedRole.Users = [];
            this.loadRoleUsers();
            this.$scope.form.$setPristine();
        }

        selectedUserChanged(): void {

        }

        isPermissionSelected(permissionId): boolean {
            let permissions = this.selectedRole.Permissions;
            if (angular.isUndefined(permissions)) return false;
            return App.Common.Utils.searchFor(permissions, "PermissionId", permissionId) != null;
        }

        permissionSelected(permission): void {
            let permissionsCount = this.selectedRole.Permissions.length;
            let permissions = this.selectedRole.Permissions.filter((item) => {
                return item.PermissionId !== permission.Id;
            });
            if (permissions.length !== permissionsCount) {
                this.selectedRole.Permissions = permissions;
            } else {
                this.selectedRole.Permissions.push(
                    {
                        PermissionId: permission.Id,
                        RoleId: this.selectedRole.Id
                    });
            }
            this.$scope.form.$setDirty();
        }

        isUserExists(userName: string): ng.IPromise<boolean> {
            let defer = this.$q.defer();
            if (userName == null || userName.length === 0) {
                defer.resolve(false);
            } else {
                defer.resolve(this.authorizationService.searchForUser(userName)
                    .then((data): boolean => {
                        return data && data.Name;
                    })
                    .catch((error) => {
                        return false;
                    }));
            }
            return defer.promise;
        }

        isRoleNameNotExists(roleName: string): ng.IPromise<boolean> {
            let defer = this.$q.defer();
            if (roleName == null || roleName.length === 0) {
                defer.resolve(false);
            } else {
                let result = this.roles.map((role) => {
                    return role.Name.toLowerCase();
                });
                defer.resolve(result.indexOf(roleName.toLowerCase()) === -1);
            }

            return defer.promise;
        }

        permitRemoveRole(): boolean {
            return angular.isUndefined(this.selectedRole.Users) || this.selectedRole.Users == null || this.selectedRole.Users.length > 0;
        }

        permitRemoveUser(): boolean {
            return true;
        }

        isRolesControlsDisabled(): boolean {
            return this.$scope.form.$dirty;
        }

        permitSubmit(): boolean {
            return this.$scope.form.$dirty;
        }

        onSubmit(): void {

        }

        submit(): void {
            let role = {
                Id: this.selectedRole.Id,
                Name: this.selectedRole.Name,
                Permissions: this.selectedRole.Permissions,
                Users: []
            };

            role.Users = this.selectedRole.Users.map((user) => {
                return { UserId: user.Id, RoleId: role.Id };
            });
            this.authorizationService.updateRole(role.Id, role)
                .then((data) => {
                    this.toastr.showToast(`Role ${role.Name} was successfully updated.`,
                        App.Common.Ui.Toaster.ToastType.Success,
                        App.Common.Ui.Toaster.ToastPosition.BottomRight);
                    let index = this.roles.map((role) => { return role.Id; }).indexOf(this.selectedRole.Id);
                    angular.copy(this.selectedRole, this.roles[index]);
                    this.$scope.form.$setPristine();
                });
        }

        permitCancel(): boolean {
            return this.$scope.form.$dirty;
        }

        cancelChanges(): void {
            let index = this.roles.map((role) => { return role.Id; }).indexOf(this.selectedRole.Id);
            angular.copy(this.roles[index], this.selectedRole);
            this.selectedRoleChanged();
        }

        addRole(): void {
            let modalSettings: ng.ui.bootstrap.IModalSettings = {
                templateUrl: '/Scripts/angular-app/widgets/inputModal.html',
                controller: 'InputModalCtrl',
                controllerAs: 'vm',
                size: 'sm',
                resolve: {
                    inputModalConfig: (): App.Widgets.IInputModalConfig => {
                        return {
                            validationMessage: (model: any) => { return 'Role with this name already exists' },
                            title: 'Add Role',
                            confirmEnabledCondition: (model): ng.IPromise<boolean> => {
                                return this.isRoleNameNotExists(model);
                            }
                        }
                    }
                }
            };
            let modalInstance = this.$uibModal.open(modalSettings);
            modalInstance.result.then((result) => {
                if (result) {
                    let role = { Name: result };
                    this.authorizationService.addRole(role)
                        .then((data) => {
                            this.loadRoles();
                        });
                }
            });
        }

        addUser(): void {
            let modalSettings: ng.ui.bootstrap.IModalSettings = {
                templateUrl: '/Scripts/angular-app/widgets/inputModal.html',
                controller: 'InputModalCtrl',
                controllerAs: 'vm',
                size: 'sm',
                resolve: {
                    inputModalConfig: (): App.Widgets.IInputModalConfig => {
                        return {
                            validationMessage: (model: any) => { return `User ${model} not found by the domain controller.` },
                            title: 'Add User',
                            confirmEnabledCondition: (model) => {
                                return this.isUserExists(model);
                            }
                        }
                    }
                }
            };
            let modalInstance = this.$uibModal.open(modalSettings);
            modalInstance.result.then((result) => {
                if (result) {
                    let users: Array<any> = this.selectedRole.Users;
                    let isUserAdded = users.some((user) => { return user.Name === result; });
                    if (!isUserAdded) {
                        this.authorizationService.addUser({ Name: result })
                            .then((data) => {
                                this.selectedRole.Users.push(data);
                                if (this.selectedUser == null || angular.isUndefined(this.selectedUser.Name)) {
                                    angular.copy(users[users.length - 1], this.selectedUser);
                                }
                                this.$scope.form.$dirty = true;
                            });
                    } else {
                        this.toastr.showToast(`User ${result} already added to ${this.selectedRole.Name} role.`,
                            App.Common.Ui.Toaster.ToastType.Info,
                            App.Common.Ui.Toaster.ToastPosition.BottomRight);
                    }
                }
            });
        }

        removeRole(): void {
            let config: ng.ui.bootstrap.IModalSettings = {
                templateUrl: '/Scripts/angular-app/widgets/confirmationModal.html',
                controller: 'ConfirmModalCtrl',
                controllerAs: 'vm',
                size: 'sm',
                resolve: {
                    confirmModalConfig: (): App.Widgets.IConfirmModalConfig => {
                        return {
                            confirmationMessage: 'Are you sure you want to remove this role?',
                            title: 'Remove Role'
                        }
                    }
                }
            };
            let modalInstance = this.$uibModal.open(config);
            modalInstance.result.then((result) => {
                if (result === 'ok') {
                    this.authorizationService.removeRole(this.selectedRole.Id)
                        .then((data) => {
                            if (data.StatusCode === 409) {
                                this.toastr
                                    .showToast(`Role ${this.selectedRole
                                        .Name} can not be deleted because it associated with users.`,
                                    App.Common.Ui.Toaster.ToastType.Error,
                                    App.Common.Ui.Toaster.ToastPosition.BottomRight);
                            } else if (data.StatusCode !== 404) {
                                this.toastr.showToast(`Role ${this.selectedRole.Name} was successfully deleted.`,
                                    App.Common.Ui.Toaster.ToastType.Success,
                                    App.Common.Ui.Toaster.ToastPosition.BottomRight);
                                this.loadRoles();
                            }
                        });
                }
            });
        }

        removeUser(): void {
            let config: ng.ui.bootstrap.IModalSettings = {
                templateUrl: '/Scripts/angular-app/widgets/confirmationModal.html',
                controller: 'ConfirmModalCtrl',
                controllerAs: 'vm',
                size: 'sm',
                resolve: {
                    confirmModalConfig: (): App.Widgets.IConfirmModalConfig => {
                        return {
                            confirmationMessage: 'Are you sure you want to remove this user?',
                            title: 'Remove User'
                        }
                    }
                }
            };
            let modalInstance = this.$uibModal.open(config);
            modalInstance.result.then((result) => {
                if (result === 'ok') {
                    for (let i = 0; i < this.selectedRole.Users.length; i++) {
                        if (this.selectedRole.Users[i].Name === this.selectedUser.Name) {
                            this.selectedRole.Users.splice(i, 1);
                            break;
                        }
                    }
                    this.toastr.showToast(`User ${this.selectedUser.Name} was successfully deleted from role ${this.selectedRole.Name}. Type save to apply changes.`,
                        App.Common.Ui.Toaster.ToastType.Success,
                        App.Common.Ui.Toaster.ToastPosition.BottomRight);
                    angular.copy(this.selectedRole.Users[0], this.selectedUser);
                    this.$scope.form.$dirty = true;
                }
            });
        }
    }

    App.getAppContainer()
        .getSection('app.manage')
        .getInstance()
        .controller('ManageRolesCtrl', ManageRolesCtrl);
}