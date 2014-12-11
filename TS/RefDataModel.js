var CTM;
(function (CTM) {
    var RefDataModel = (function () {
        function RefDataModel() {
            this.listArticle = new Array();
        }
        RefDataModel.prototype.addReference = function (title, author, journal, volume, issue, pages, year, publisher) {
            var item = new CTM.Article();
            item.index = CTM.Utils.guid();
            item.title = title;
            item.author = author;
            item.journal = journal;
            item.volume = volume;
            item.issue = issue;
            item.pages = pages;
            item.year = year;
            item.publisher = publisher;
            this.listArticle.push(item);
        };
        RefDataModel.prototype.removeReference = function (index) {
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
        };
        RefDataModel.prototype.generateReferenceTable = function () {
            var html = "";
            var itemList = new Array();
            for (var i = 0; i < this.listArticle.length; i++) {
                if (document.getElementById("radioMLA").checked) {
                    itemList.push("<div>" + CTM.ReferenceItemFactory.instance().create(this.listArticle[i]) + "</div>");
                }
                else if (document.getElementById("radioAPA").checked) {
                    itemList.push("<div>" + CTM.ApaReferenceItemFactory.instance().create(this.listArticle[i]) + "</div>");
                }
                else if (document.getElementById("radioChicago").checked) {
                    itemList.push("<div>" + CTM.ChicagoReferenceItemFactory.instance().create(this.listArticle[i]) + "</div>");
                }
            }
            itemList.sort();
            for (var i = 0; i < itemList.length; i++) {
                html += itemList[i];
            }
            return html;
        };
        RefDataModel.prototype.loadSetting = function () {
            // Load the data from setting.
            var data = Office.context.document.settings.get('CTM_Data');
            if (data == null || data == "")
                return;
            var tmpList = JSON.parse(data);
            for (var i = 0; i < tmpList.length; i++) {
                var item = new CTM.Article();
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
                    var onBindingSelectionChanged = function (eventArgs) {
                        var tmpArray = eventArgs.binding.id.split("_");
                        if (tmpArray.length < 3) {
                            // Exception happens
                            return;
                        }
                        var index = tmpArray[2];
                        CTM.MainPageUi.refControl.showItem(index);
                    };
                    Office.select("bindings#" + bindingName).addHandlerAsync(Office.EventType.BindingSelectionChanged, onBindingSelectionChanged);
                }
            }
        };
        RefDataModel.prototype.loadTestingRef = function () {
            this.addReference("Analysis of the airport network of India as a complex weighted network", "Bagler, Ganesh", "Physica A: Statistical Mechanics and its Applications", "387", "12", "2972--2980", "2008", "Elsevier");
            this.addReference("A spatial analysis of FedEx and UPS: hubs, spokes, and network structure", "Bowen Jr., J. T.", "Journal of Transport Geography", "24", "", "419-431", "2012", "Elsevier");
            this.addReference("Will China’s airline industry survive the entry of high-speed rail?", "Fu, Xiaowen ; Zhang, Anming ; Lei, Zheng", "Research in Transportation Economics", "35", "1", "13-25", "2012", "Elsevier");
            this.addReference("The hub network design problem: a review and synthesis", "O'Kelly, Morton E ; Miller, Harvey J", "Journal of Transport Geography", "2", "1", "31-40", "1994", "Elsevier");
        };
        RefDataModel.prototype.saveToSetting = function () {
            var data = JSON.stringify(this.listArticle);
            Office.context.document.settings.set('CTM_Data', data);
            Office.context.document.settings.saveAsync(function (asyncResult) {
                if (asyncResult.status == "failed") {
                    CTM.Utils.showMessage("Action failed with error: " + asyncResult.error.message);
                }
                else {
                    CTM.Utils.showMessage("Data saved.");
                }
            });
        };
        RefDataModel.refCounter = 0;
        return RefDataModel;
    })();
    CTM.RefDataModel = RefDataModel;
})(CTM || (CTM = {}));
//# sourceMappingURL=RefDataModel.js.map