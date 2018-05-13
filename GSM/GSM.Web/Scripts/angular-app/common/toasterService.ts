namespace App.Common.Ui.Toaster {

    export enum ToastType {
        Success,
        Info,
        Warning,
        Error,
        Custom
    }

    export enum ToastPosition {
        TopRight,
        BottomRight,
        TopLeft,
        BottomLeft,
        TopFullWidth,
        BottomFullWidth,
        TopCenter,
        BottomCenter
    }

    export interface IToastServiceInstance {
        showToast(message: string, type: ToastType, position?: ToastPosition, options?: any, updateInstance?: boolean, closeOnClick?: boolean);
    }

    export class SimpleToastInstance implements IToastServiceInstance {
        private defaultOptions: any = {
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

        static $inject = ['toastr'];
        constructor(private toastr) {
        }

        public showToast(message: string, type: ToastType, position?: ToastPosition, options?: any, updateInstance?: boolean, closeOnClick?: boolean) {
            if (!options) {
                this.toastr.options = this.defaultOptions;
            } else {
                this.toastr.options = options;
            }
            let toastPosition: string = this.getToastrPosotionClass(position);
            this.toastr.options.positionClass = toastPosition;

            if (closeOnClick) {
                this.toastr.options.onclick = () => {
                    $('.toast .toast-close-button').click();
                };
            }

            let toastType: string = this.getToastrType(type);
            this.toastr[toastType](message);
        }

        private getToastrType(type: ToastType) {
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
        }

        private getToastrPosotionClass(position: ToastPosition) {
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
        }
    }

    export interface IToastService {
        getToastServiceInstance(): IToastServiceInstance;
    }

    export class ToastService implements IToastService {

        static $inject = ['logger', 'toastr'];
        constructor(private log: App.Common.Logger.ILogger, private toastr) { }

        getToastServiceInstance(): IToastServiceInstance {
            if (!this.toastr) {
                this.log.error(new App.Common.Logger.Exception("Toastr object doesn't exists. Add link to toastr.js"));
            }
            return new SimpleToastInstance(this.toastr);

        }
    }

    App.getAppContainer()
        .getSection('common')
        .getInstance()
        .service('toastService', ToastService);
}