namespace App.Framework {
    export interface IApp {
        addSection(section: ISection, isRoot?: boolean): void;
        getSection(sectioName: string): ISection;
        getRootSection(): ISection;
        bootstrap(callback: Function): void;
    }

    export class App implements IApp {
        private rootSection: ISection;
        private sectionsContainer: ISection[];

        constructor() {
            this.sectionsContainer = [];
        }

        addSection(section: ISection, isRoot?: boolean): void {
            this.sectionsContainer.push(section);
            if (isRoot) {
                this.rootSection = section;
                section.register();
            } else {
                section.register(this.rootSection.name);
            }
        }

        getSection(sectionName: string): ISection {
            for (let i = 0; i < this.sectionsContainer.length; i++) {
                if (this.sectionsContainer[i].name === sectionName) {
                    return this.sectionsContainer[i];
                }
            }

            throw new Error('There is no section ' + sectionName + ' registered in application container');
        }

        getRootSection() {
            return this.rootSection;
        }

        bootstrap(callback: Function): void {
            callback();
        }
    }
}