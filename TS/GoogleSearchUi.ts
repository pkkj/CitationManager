module CTM {
    export class GoogleSearchUi {
        public element: HTMLElement;
        public txtTitle: HTMLInputElement;
        public txtAuthor: HTMLInputElement;
        public resultContainer: HTMLElement;
        public divSearching: HTMLElement;
        public buttonSearch: HTMLButtonElement;
        public buttonBack: HTMLButtonElement;
        constructor() {
            this.element = document.getElementById("searchInGoogleForm");
            this.divSearching = document.getElementById("searchInGoogleForm_searching");
            this.resultContainer = document.getElementById("resultContainer");
            this.txtTitle = <HTMLInputElement>document.getElementById("searchInGoogle_title");
            this.txtAuthor = <HTMLInputElement>document.getElementById("searchInGoogle_author");


            this.buttonSearch = <HTMLButtonElement>document.getElementById("searchInGoogle_search");
            this.buttonBack = <HTMLButtonElement>document.getElementById("searchInGoogle_back");

            this.buttonSearch.onclick = this.search;
                
            
            this.buttonBack.onclick = () => {
                this.close();
            }
        }

        private search = () => {
            this.divSearching.style.display = "block";
            this.resultContainer.style.display = "none";
            this.resultContainer.innerHTML = "";
            var useMockData = false;

            if (useMockData) {
                var res = '[{"Type":null,"Title":"A comprehensive foundation","Journal":"Neural Networks","Author":["Haykin, Simon","Network, Neural"],"Volume":"2","Issue":"2004","Pages":null,"Year":"2004","Publisher":null},{"Type":null,"Title":"Status of coral reefs of the world: 2008","Journal":null,"Author":["Wilkinson, Clive","Network, Global Coral Reef Monitoring"],"Volume":null,"Issue":null,"Pages":null,"Year":"2008","Publisher":"Global Coral Reef Monitoring Network Townsville"},{"Type":null,"Title":"A second-generation current conveyor and its applications","Journal":"IEEE Transactions on Circuit Theory","Author":["Network, AOCCA","Cherry, E"],"Volume":null,"Issue":null,"Pages":"301-302","Year":"1970","Publisher":null}]';
                
                setTimeout(() => { this.onSearchFinished(res);}, 1000);
                return;
            }
            
            var params = { "author": this.txtAuthor.value, "phrase": this.txtTitle.value };
            Utils.ajaxQuery(params, "QueryGoogleScholar", this.onSearchFinished);
        };

        private onSearchFinished = (jsonText: string) => {
            this.divSearching.style.display = "none";
            var data = [];
            if (jsonText == "") {
                return;
            }
            var jsonObj: Array<any> = <Array<any>>$.parseJSON(jsonText);
            this.showResult(jsonObj);
        };

        public show() {
            this.txtTitle.value = "";
            this.txtAuthor.value = "";
            document.getElementById("mainUi").style.display = "none";
            this.element.style.display = "block";
            this.resultContainer.style.display = "none";
            this.divSearching.style.display = "none";
        }
        public close() {
            this.element.style.display = "none";
            document.getElementById("mainUi").style.display = "block";
        }

        public clearResult() {
            this.resultContainer.textContent = "";
        }

        public createResultItem(refData: Article): HTMLElement {
            var div = Utils.createElement("div", { "class": "searchResultItem" });
            var insertImg = Utils.createElement("img", { "class": "insertIcon", "src": "../Images/addSmall.png" });
            insertImg.onclick = () => {
                Utils.showMessage('Article "' + refData.title + '" is added to collection.');
                MainPageUi.refDataModel.addReference(refData.title, refData.author, refData.journal, refData.volume, refData.issue, refData.pages, refData.year, "");
                MainPageUi.refControl.setup();
            };
            div.appendChild(insertImg);

            var innerDiv = Utils.createElement("div", { "class": "searchResultItemInner" });
            innerDiv.appendChild(Utils.createElement("div", {
                "class": "searchResultRefTitle",
                "text": refData.title
            }));

            var detailInfo = document.createElement("div");
            detailInfo.appendChild(Utils.createElement("span", {
                "text": ReferenceItemFactory.handleAuthor( refData.author)
            }));

            if (refData.journal != null) {
                detailInfo.appendChild(Utils.createElement("span", {
                    "text": " - "
                }))
                detailInfo.appendChild(Utils.createElement("i", {
                    "text": refData.journal
                }))
            }

            if (refData.year != null) {
                detailInfo.appendChild(Utils.createElement("span", {
                    "text": ", "
                }))
                detailInfo.appendChild(Utils.createElement("span", {
                    "text": refData.year
                }))
            }

            innerDiv.appendChild(detailInfo);
            div.appendChild(innerDiv);
            div.appendChild(Utils.createElement("div", { "class": "clear" }));
            return div;
        }
        public showResult(resList: Array<any>) {
            for (var i = 0; i < resList.length; i++) {
                var article: Article = new Article();
                article.title = resList[i]["Title"];
                article.author = "";
                if (resList[i]["Author"] != null) {
                    for (var j = 0; j < resList[i]["Author"].length; j++) {
                        if (j != 0) {
                            article.author += ";";
                        }
                        article.author += resList[i]["Author"][j];
                    }
                }
                article.journal = resList[i]["Journal"];
                article.year = resList[i]["Year"];
                article.volume = resList[i]["Volume"];
                article.issue = resList[i]["Issue"];
                article.pages = resList[i]["Pages"];
                this.resultContainer.appendChild( this.createResultItem(article));

            }

            this.resultContainer.style.display = "block";
        }
    }
} 

(function () {

    $(document).ready(function () {
        var mainUi = new CTM.GoogleSearchUi();

    });
    
})();
