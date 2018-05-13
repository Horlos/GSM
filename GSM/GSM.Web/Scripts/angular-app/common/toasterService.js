var App;
(function (App) {
    var Common;
    (function (Common) {
        var Ui;
        (function (Ui) {
            var Toaster;
            (function (Toaster) {
                (function (ToastType) {
                    ToastType[ToastType["Success"] = 0] = "Success";
                    ToastType[ToastType["Info"] = 1] = "Info";
                    ToastType[ToastType["Warning"] = 2] = "Warning";
                    ToastType[ToastType["Error"] = 3] = "Error";
                    ToastType[ToastType["Custom"] = 4] = "Custom";
                })(Toaster.ToastType || (Toaster.ToastType = {}));
                var ToastType = Toaster.ToastType;
                (function (ToastPosition) {
                    ToastPosition[ToastPosition["TopRight"] = 0] = "TopRight";
                    ToastPosition[ToastPosition["BottomRight"] = 1] = "BottomRight";
                    ToastPosition[ToastPosition["TopLeft"] = 2] = "TopLeft";
                    ToastPosition[ToastPosition["BottomLeft"] = 3] = "BottomLeft";
                    ToastPosition[ToastPosition["TopFullWidth"] = 4] = "TopFullWidth";
                    ToastPosition[ToastPosition["BottomFullWidth"] = 5] = "BottomFullWidth";
                    ToastPosition[ToastPosition["TopCenter"] = 6] = "TopCenter";
                    ToastPosition[ToastPosition["BottomCenter"] = 7] = "BottomCenter";
                })(Toaster.ToastPosition || (Toaster.ToastPosition = {}));
                var ToastPosition = Toaster.ToastPosition;
                var SimpleToastInstance = (function () {
                    function SimpleToastInstance(toastr) {
                        this.toastr = toastr;
                        this.defaultOptions = {
                            closeButton: true,
                            debug: false,
                            newestOnTop: false,
                            progressBar: true,
                            positionClass: 'toast-bottom-right',
                            preventDuplicates: true,
                            onclick: null,
                            showDuration: 300,
                            hideDuration: 500,
                            timeOut: 5000,
                            extendedTimeOut: 1000,
                            showEasing: 'swing',
                            hideEasing: 'linear',
                            showMethod: 'fadeIn',
                            hideMethod: 'fadeOut'
                        };
                    }
                    SimpleToastInstance.prototype.showToast = function (message, type, position, options, updateInstance, closeOnClick) {
                        if (!options) {
                            this.toastr.options = this.defaultOptions;
                        }
                        else {
                            this.toastr.options = options;
                        }
                        var toastPosition = this.getToastrPosotionClass(position);
                        this.toastr.options.positionClass = toastPosition;
                        if (closeOnClick) {
                            this.toastr.options.onclick = function () {
                                $('.toast .toast-close-button').click();
                            };
                        }
                        var toastType = this.getToastrType(type);
                        this.toastr[toastType](message);
                    };
                    SimpleToastInstance.prototype.getToastrType = function (type) {
                        switch (type) {
                            case ToastType.Error:
                                return 'error';
                            case ToastType.Info:
                                return 'info';
                            case ToastType.Success:
                                return 'success';
                            case ToastType.Warning:
                                return 'warning';
                            case ToastType.Custom:
                                return 'info';
                            default:
                                return 'error';
                        }
                    };
                    SimpleToastInstance.prototype.getToastrPosotionClass = function (position) {
                        switch (position) {
                            case ToastPosition.TopRight:
                                return "toast-top-right";
                            case ToastPosition.BottomRight:
                                return "toast-bottom-right";
                            case ToastPosition.TopLeft:
                                return "toast-top-left";
                            case ToastPosition.BottomLeft:
                                return "toast-bottom-left";
                            case ToastPosition.TopFullWidth:
                                return "toast-top-full-width";
                            case ToastPosition.BottomFullWidth:
                                return "toast-bottom-full-width";
                            case ToastPosition.TopCenter:
                                return "toast-top-center";
                            case ToastPosition.BottomCenter:
                                return "toast-bottom-center";
                            default:
                                return "toast-top-right";
                        }
                    };
                    SimpleToastInstance.$inject = ['toastr'];
                    return SimpleToastInstance;
                }());
                Toaster.SimpleToastInstance = SimpleToastInstance;
                var ToastService = (function () {
                    function ToastService(log, toastr) {
                        this.log = log;
                        this.toastr = toastr;
                    }
                    ToastService.prototype.getToastServiceInstance = function () {
                        if (!this.toastr) {
                            this.log.error(new App.Common.Logger.Exception("Toastr object doesn't exists. Add link to toastr.js"));
                        }
                        return new SimpleToastInstance(this.toastr);
                    };
                    ToastService.$inject = ['logger', 'toastr'];
                    return ToastService;
                }());
                Toaster.ToastService = ToastService;
                App.getAppContainer()
                    .getSection('common')
                    .getInstance()
                    .service('toastService', ToastService);
            })(Toaster = Ui.Toaster || (Ui.Toaster = {}));
        })(Ui = Common.Ui || (Common.Ui = {}));
    })(Common = App.Common || (App.Common = {}));
})(App || (App = {}));
//# sourceMappingURL=toasterService.js.map