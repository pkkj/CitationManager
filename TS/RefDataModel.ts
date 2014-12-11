module CTM {
    export class RefDataModel {
        static refCounter = 0;
        public listArticle: Array<Article>;

        constructor() {
            this.listArticle = new Array<Article>();
        }

        public addReference(title: string, author: string, journal: string, volume: string, issue: string, pages: string, year: string, publisher: string) {
            var item = new Article();
            item.index = Utils.guid();
            item.title = title;
            item.author = author;
            item.journal = journal;
            item.volume = volume;
            item.issue = issue;
            item.pages = pages;
            item.year = year;
            item.publisher = publisher;
            this.listArticle.push(item);
        }

        public removeReference(index: string) {
            var removeAt = -1;
            for (var i = 0; i < this.listArticle.length; i++) {
                if (this.listArticle[i].index == index) {
                    removeAt = i;
                    break;
                }
            }
            if (removeAt != -1) {
                this.listArticle.splice(removeAt, 1);
            }
        }

        public generateReferenceTable(): string {
            var html: string = "";
            var itemList: Array<string> = new Array<string>();
            for (var i = 0; i < this.listArticle.length; i++) {
                if ((<HTMLInputElement>document.getElementById("radioMLA")).checked) {
                    itemList.push("<div>" + CTM.ReferenceItemFactory.instance().create(this.listArticle[i]) + "</div>");
                } else if ((<HTMLInputElement>document.getElementById("radioAPA")).checked) {
                    itemList.push("<div>" + CTM.ApaReferenceItemFactory.instance().create(this.listArticle[i]) + "</div>");
                } else if ((<HTMLInputElement>document.getElementById("radioChicago")).checked) {
                    itemList.push("<div>" + CTM.ChicagoReferenceItemFactory.instance().create(this.listArticle[i]) + "</div>");
                }
                
            }
            itemList.sort();
            for (var i = 0; i < itemList.length; i++) {
                html += itemList[i];
            }
            return html;
        }

        public loadSetting() {
            // Load the data from setting.
            var data = Office.context.document.settings.get('CTM_Data');
            if (data == null || data == "")
                return;
            var tmpList: Array<Article> = JSON.parse(data);
            for (var i = 0; i < tmpList.length; i++) {
                var item = new Article();
                item.index = tmpList[i].index;
                item.title = tmpList[i].title;
                item.author = tmpList[i].author;
                item.journal = tmpList[i].journal;
                item.volume = tmpList[i].volume;
                item.issue = tmpList[i].issue;
                item.pages = tmpList[i].pages;
                item.year = tmpList[i].year;
                item.publisher = tmpList[i].publisher;
                item.bindingCounter = tmpList[i].bindingCounter;
                item.bindingList = tmpList[i].bindingList;
                item.bindingNavIndex = 0;
                this.listArticle.push(item);
                for (var j = 0; j < item.bindingList.length; j++) {
                    var bindingName = item.bindingList[j];
                    var onBindingSelectionChanged = (eventArgs) => {
                        var tmpArray = (<string>eventArgs.binding.id).split("_");
                        if (tmpArray.length < 3) {
                            // Exception happens
                            return;
                        }
                        var index = tmpArray[2];
                        MainPageUi.refControl.showItem(index);
                    };
                    Office.select("bindings#" + bindingName).addHandlerAsync(Office.EventType.BindingSelectionChanged, onBindingSelectionChanged);
                }
                
            }
        }

        public loadTestingRef() {
            this.addReference(
                "Analysis of the airport network of India as a complex weighted network",
                "Bagler, Ganesh",
                "Physica A: Statistical Mechanics and its Applications",
                "387",
                "12",
                "2972--2980",
                "2008",
                "Elsevier");
            this.addReference(
                "A spatial analysis of FedEx and UPS: hubs, spokes, and network structure",
                "Bowen Jr., J. T.",
                "Journal of Transport Geography",
                "24",
                "",
                "419-431",
                "2012",
                "Elsevier");

            this.addReference(
                "Will China’s airline industry survive the entry of high-speed rail?",
                "Fu, Xiaowen ; Zhang, Anming ; Lei, Zheng",
                "Research in Transportation Economics",
                "35",
                "1",
                "13-25",
                "2012",
                "Elsevier");

            this.addReference(
                "The hub network design problem: a review and synthesis",
                "O'Kelly, Morton E ; Miller, Harvey J",
                "Journal of Transport Geography",
                "2",
                "1",
                "31-40",
                "1994",
                "Elsevier");
        }
        public saveToSetting() {
            var data = JSON.stringify(this.listArticle);
            Office.context.document.settings.set('CTM_Data', data);

            Office.context.document.settings.saveAsync(function (asyncResult) {
                if (asyncResult.status == "failed") {
                    Utils.showMessage("Action failed with error: " + asyncResult.error.message);
                }
                else {
                    Utils.showMessage("Data saved.");
                }
            });
        }
    }
}