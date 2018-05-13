namespace App.Common.DataProvider {
    export enum DataSourceType {
        JQuery,
        Angular
    }

    export interface IDataSource {
        get(config?: any);
        head(config?: any);
        post(entity?: any, config?: any);
        put(entity: any, config?: any);
        delete(config?: any);
        patch(entity: any, config?: any);
    }

    export interface IAngularDataSource<T> extends IDataSource {
        get(config?: ng.IRequestShortcutConfig): ng.IHttpPromise<T>;
        head(config?: ng.IRequestShortcutConfig): ng.IHttpPromise<T>;
        post(entity?: T, config?: ng.IRequestShortcutConfig): ng.IHttpPromise<T>;
        put(entity: T, config?: ng.IRequestShortcutConfig): ng.IHttpPromise<T>;
        delete(config?: ng.IRequestShortcutConfig): ng.IHttpPromise<T>;
        patch(entity: T, config?: ng.IRequestShortcutConfig): ng.IHttpPromise<T>;
    }

    export class AngularDataSource<T> implements IAngularDataSource<T> {
        constructor(private url: string, private $http: ng.IHttpService) { }

        public get(config?: ng.IRequestShortcutConfig): ng.IHttpPromise<T> {
            return this.$http.get(this.url, config);
        }

        public head(config?: ng.IRequestShortcutConfig): ng.IHttpPromise<T> {
            return this.$http.head(this.url, config);
        }

        public post(entity?: T, config?: ng.IRequestShortcutConfig): ng.IHttpPromise<T> {
            return this.$http.post(this.url, entity, config);
        }

        public put(entity: T, config?: ng.IRequestShortcutConfig): ng.IHttpPromise<T> {
            return this.$http.put(this.url, entity, config);
        }

        public delete(config?: ng.IRequestShortcutConfig): ng.IHttpPromise<T> {
            return this.$http.delete(this.url, config);
        }

        public patch(entity: T, config?: ng.IRequestShortcutConfig): ng.IHttpPromise<T> {
            return this.$http.patch(this.url, entity, config);
        }
    }

    export interface IJQueryDataSource<T> extends IDataSource {
        get(config?: JQueryAjaxSettings): JQueryPromise<T>;
        head(config?: JQueryAjaxSettings): JQueryPromise<T>;
        post(entity?: T, config?: JQueryAjaxSettings): JQueryPromise<T>;
        put(entity: T, config?: JQueryAjaxSettings): JQueryPromise<T>;
        delete(config?: JQueryAjaxSettings): JQueryPromise<T>;
        patch(entity: T, config?: JQueryAjaxSettings): JQueryPromise<T>;
    }

    export class JQueryDataSource<T> implements IJQueryDataSource<T> {
        constructor(private url: string) { }

        get(config?: JQueryAjaxSettings): JQueryPromise<T> {
            return $.get(this.url);
        }

        head(config?: JQueryAjaxSettings): JQueryPromise<T> {
            return $.ajax({
                type: 'HEAD',
                async: true,
                url: this.url
            });
        }

        post(entity?: T, config?: JQueryAjaxSettings): JQueryPromise<T> {
            return $.post(this.url, entity);
        }

        put(entity: T, config?: JQueryAjaxSettings): JQueryPromise<T> {
            return $.ajax({
                type: 'PUT',
                async: true,
                url: this.url
            });
        }

        delete(config?: JQueryAjaxSettings): JQueryPromise<T> {
            return $.ajax({
                type: 'DELETE',
                async: true,
                url: this.url
            });
        }

        patch(entity: T, config?: JQueryAjaxSettings): JQueryPromise<T> {
            return $.ajax({
                type: 'PATCH',
                async: true,
                url: this.url
            });
        }
    }

    export interface IDataProvider {
        getDataProvider(url: string, dataSourceType?: DataSourceType): IDataSource;
    }
}