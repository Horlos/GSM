namespace App.Common.Filters {

    export class ChunkFilter {
        static filter() {
            return (items: Array<any>, size: number) => {
                //return items.filter((item, index) => {
                //    return index % size === 0;
                //});
                var chunkedData = [];
                for (let i = 0; i < items.length; i += size) {
                    chunkedData.push(items.slice(i, i + size));
                }
                return chunkedData;
            };
        }
    }

    App.getAppContainer()
        .getSection('common')
        .getInstance()
        .filter('chunk', ChunkFilter.filter);
}