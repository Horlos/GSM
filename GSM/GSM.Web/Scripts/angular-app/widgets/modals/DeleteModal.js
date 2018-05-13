function DeleteConfirmation() {
    var modalInstance = this.uibModal.open({
        templateUrl: 'deleteConfirmation.html',
        controller: 'ModalInstanceCtrl',
        size: 'sm'
    });
    modalInstance.result.then(angular.bind(this, function (response) {
        this.scope.delete(response);
    }), function () { });
};

function DeleteCompleted() {
    var modalInstance = this.uibModal.open({
        templateUrl: 'deleteCompleted.html',
        controller: 'ModalInstanceCtrl',
        size: 'sm'
    });
    modalInstance.result.then(angular.bind(this, function (response) {
        this.window.location.href = this.back;
    }), function () { });
};

function OnDeleteCompleted(deletedItem) {
    this.scope.deleteCompleted();
}