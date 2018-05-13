namespace App.Common {
    export class Utils {

        static lastUrlParam(url: string): string {
            let urlAsArray = url.split('/');
            return urlAsArray[urlAsArray.length - 1];
        }

        static searchFor(array: Array<any>, searchProperty: string, searchVal: any): any {
            var result = null;
            $.each(array,
                (index) => {
                    if (array[index][searchProperty] === searchVal) {
                        result = array[index];
                    }
                });

            return result;
        }

        static findAndRemove(array, item) {
            $.each(array,
                (index, result) => {
                    if (result == item) {
                        array.splice(index, 1);
                    }
                });
        }

        static addRange(array, arrayToAdd) {
            $.each(arrayToAdd,
                (index, result) => {
                    array.push(result);
                });
        }
    }
}