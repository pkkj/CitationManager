module CTM {
    export class Article {
        public index: string;
        public title: string;
        public author: string;

        public journal: string;
        public volume: string;
        public issue: string;
        public pages: string;
        public year: string;
        public publisher: string;


        public bindingList: Array<string> = new Array<string>();
        public bindingNavIndex = 0;
        public bindingCounter = 0;
        
        constructor() {
        }

        public static makeArticle(index: number, title: string, author: string, journal: string, volume: string, issue: string, pages: string, year: string, publisher: string): Article {
            var item = new Article();
            item.title = title;
            item.author = author;
            item.journal = journal;
            item.volume = volume;
            item.issue = issue;
            item.pages = pages;
            item.year = year;
            item.publisher = publisher;

            return item;
        }

        public resolveBinding(onFinished) {
            if (this.bindingList.length == 0) {
                if (onFinished) {
                    onFinished();
                }
                return;
            }
            var validBinding = [];
            var finishedCount = 0;

            for (var i = 0; i < this.bindingList.length; i++) {

                Office.context.document.bindings.getByIdAsync(this.bindingList[i], (asyncResult) => {
                    finishedCount++;
                    if (asyncResult.status == "failed") {
                    } else {
                        validBinding.push(asyncResult.value.id);
                    }
                    if (finishedCount == this.bindingList.length) {
                        this.bindingList = validBinding;
                        if (onFinished)
                            onFinished();
                    }
                });

            }
            
        }

        public insertCitation() {
            var bindingName = "cite_" + this.bindingCounter + "_" + this.index;
            this.bindingCounter++;

            Office.context.document.setSelectedDataAsync(InDocumentCitationFactory.instance().create(this), { coercionType: "html" }, (asyncResult1) => {
                Office.context.document.bindings.addFromSelectionAsync(Office.BindingType.Text, { id: bindingName },
                    (asyncResult2) => {
                        this.bindingList.push(bindingName);

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

                        Utils.showMessage("Citation inserted");
                    });
            });
        }

        public goto() {
            this.resolveBinding(() => {
                if (this.bindingList.length == 0) {
                    Utils.showMessage("No citation inserted yet");
                    return;
                }

                if (this.bindingNavIndex >= this.bindingList.length) {
                    this.bindingNavIndex = 0;
                }
                var nextBinding = this.bindingList[this.bindingNavIndex];
                Office.context.document.goToByIdAsync(nextBinding, Office.GoToType.Binding, (asyncResult) => {
                    this.bindingNavIndex++;
                    if (asyncResult.status == "failed") {
                        Utils.showMessage("Action failed with error: " + asyncResult.error.message);
                    }
                    else {
                        Utils.showMessage("Navigation successful");
                    }
                });
            });
            
            
        }

        public removeCitation(callback = null) {
            this.resolveBinding(() => {
                
                var bindingCount = this.bindingList.length;
                if (bindingCount == 0) {
                    if (callback != null)
                        callback();
                    return;
                }
                var removedCount1 = 0;
                for (var i = 0; i < this.bindingList.length; i++) {
                    Office.select("bindings#" + this.bindingList[i]).setDataAsync("",
                        (asyncResult1) => {
                            removedCount1++;
                            if (removedCount1 == bindingCount) {
                                var removedCount2 = 0;
                                for (var j = 0; j < this.bindingList.length; j++) {
                                    Office.context.document.bindings.releaseByIdAsync(this.bindingList[j], (asyncResult2) => {
                                        if (asyncResult2.status == "failed") {
                                            Utils.showMessage("Action failed with error: " + asyncResult2.error.message);
                                        }
                                        else {
                                            Utils.showMessage("Citation removed.");
                                        }
                                        removedCount2++;
                                        if (removedCount2 == bindingCount) {
                                            this.bindingList = [];
                                            if (callback != null) {
                                                callback();
                                            }
                                        }

                                    });
                                }
                            }
                        });
                }

            });

        }

        public delete() {
            
            var onCitationRemoved = () => {
                // Notify the dataModel: remove itself from the list
                MainPageUi.refDataModel.removeReference(this.index);
                // Refresh the table.
                MainPageUi.refControl.setup();
            };

            // Remove all the citation
            this.removeCitation(onCitationRemoved);

        }
    }

    export class InDocumentCitationFactory {
        public create(item: Article): string {
            var s: string = "";
            s = InDocumentCitationFactory.handleAuthor(item.author) + ", " + item.year;
            s = "(" + s + ")";
            return s;
        }

        public static _instance: InDocumentCitationFactory;
        public static instance(): InDocumentCitationFactory {
            if (InDocumentCitationFactory._instance == null) {
                InDocumentCitationFactory._instance = new InDocumentCitationFactory();
            }
            return InDocumentCitationFactory._instance;
        }

        public static handleAuthor(authors: string) {
            var authorList: Array<string> = authors.split(";");
            var res = "";
            if (authorList.length == 1) {
                res = authorList[0].trim() ;
            } else if (authorList.length == 2) {
                res = authorList[0].trim() + " and " + authorList[1].trim() ;
            } else {
                res = authorList[0].trim() + " and " + authorList[1].trim()  + ", et al";
            }
            return res;
        }
    }

    export class ReferenceItemFactory {

        public create(item: Article): string {
            var element = document.createElement("span");
            var s: string;
            s = '%AUTHOR% "%TITLE%" ';
            s = s.replace("%AUTHOR%", ReferenceItemFactory.handleAuthor(item.author));
            s = s.replace("%TITLE%", item.title);
            element.appendChild(CTM.Utils.createElement("span", { "text": s }));

            element.appendChild(CTM.Utils.createElement("i", { "text": item.journal }));

            s = " %VOLUME%.%ISSUE% (%YEAR%): %PAGES%.";
            if (item.volume == null || item.issue == null) {
                s = s.replace("%VOLUME%.%ISSUE% ", "");
            }
            else {
                s = s.replace("%VOLUME%", item.volume);
                s = s.replace("%ISSUE%", item.issue);
            }
            s = s.replace("%YEAR%", item.year);
            if (item.pages != null) {
                s = s.replace("%PAGES%", item.pages);
            } else {
                s = s.replace(": %PAGES%", "");
            }
            element.appendChild(CTM.Utils.createElement("span", { "text": s }));

            return element.innerHTML;
        }

        public static handleAuthor(authors: string) {
            var authorList: Array<string> = authors.split(";");
            var res = "";
            for (var i = 0; i < authorList.length; i++) {
                var author = authorList[i].trim();
                if (i != 0) {
                    if (i == authorList.length - 1)
                        res += " and ";
                    else
                        res += ", ";
                    
                }
                res += author;
            }
            return res;
        }

        public static _instance: ReferenceItemFactory;
        public static instance(): ReferenceItemFactory {
            if (ReferenceItemFactory._instance == null) {
                ReferenceItemFactory._instance = new ReferenceItemFactory();
            }
            return ReferenceItemFactory._instance;
        }
    }

    export class ApaReferenceItemFactory {
        public create(item: Article): string {
            var element = document.createElement("span");
            var s: string;
            s = '%AUTHOR% (%YEAR%). %TITLE% ';
            s = s.replace("%AUTHOR%", ApaReferenceItemFactory.handleAuthor(item.author));
            s = s.replace("%YEAR%", item.year);
            s = s.replace("%TITLE%", item.title);
            element.appendChild(CTM.Utils.createElement("span", { "text": s }));

            element.appendChild(CTM.Utils.createElement("i", { "text": item.journal }));

            s = " %VOLUME%(%ISSUE%), %PAGES%.";
            if (item.volume == null || item.issue == null) {
                s = s.replace(" %VOLUME%(%ISSUE%)", "");
            }
            else {
                s = s.replace("%VOLUME%", item.volume);
                s = s.replace("%ISSUE%", item.issue);
            }
            
            if (item.pages != null) {
                s = s.replace("%PAGES%", item.pages);
            } else {
                s = s.replace(", %PAGES%", "");
            }
            element.appendChild(CTM.Utils.createElement("span", { "text": s }));

            return element.innerHTML;
        }

        public static handleAuthor(authors: string) {
            var authorList: Array<string> = authors.split(";");
            var res = "";
            for (var i = 0; i < authorList.length; i++) {
                var author = authorList[i].trim();
                if (i != 0) {
                    if (i == authorList.length - 1)
                        res += " & ";
                    else
                        res += ", ";

                }
                res += author;
            }
            return res;
        }

        public static _instance: ApaReferenceItemFactory;
        public static instance(): ApaReferenceItemFactory {
            if (ApaReferenceItemFactory._instance == null) {
                ApaReferenceItemFactory._instance = new ApaReferenceItemFactory();
            }
            return ApaReferenceItemFactory._instance;
        }
    }

    export class ChicagoReferenceItemFactory {
        public create(item: Article): string {
            var element = document.createElement("span");
            var s: string;
            s = '%AUTHOR% "%TITLE%" ';
            s = s.replace("%AUTHOR%", ReferenceItemFactory.handleAuthor(item.author));
            s = s.replace("%TITLE%", item.title);
            element.appendChild(CTM.Utils.createElement("span", { "text": s }));

            element.appendChild(CTM.Utils.createElement("i", { "text": item.journal }));

            s = " %VOLUME%, no. %ISSUE% (%YEAR%): %PAGES%.";
            if (item.volume == null || item.issue == null) {
                s = s.replace("%VOLUME%, no. %ISSUE% ", "");
            }
            else {
                s = s.replace("%VOLUME%", item.volume);
                s = s.replace("%ISSUE%", item.issue);
            }
            s = s.replace("%YEAR%", item.year);
            if (item.pages != null) {
                s = s.replace("%PAGES%", item.pages);
            } else {
                s = s.replace(": %PAGES%", "");
            }
            element.appendChild(CTM.Utils.createElement("span", { "text": s }));

            return element.innerHTML;
        }

        public static _instance: ChicagoReferenceItemFactory;
        public static instance(): ChicagoReferenceItemFactory {
            if (ChicagoReferenceItemFactory._instance == null) {
                ChicagoReferenceItemFactory._instance = new ChicagoReferenceItemFactory();
            }
            return ChicagoReferenceItemFactory._instance;
        }
    }
}