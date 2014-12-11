var CTM;
(function (CTM) {
    var GoogleSearchUi = (function () {
        function GoogleSearchUi() {
            var _this = this;
            this.search = function () {
                _this.divSearching.style.display = "block";
                _this.resultContainer.style.display = "none";
                _this.resultContainer.innerHTML = "";
                var useMockData = false;
                if (useMockData) {
                    var res = '[{"Type":null,"Title":"A comprehensive foundation","Journal":"Neural Networks","Author":["Haykin, Simon","Network, Neural"],"Volume":"2","Issue":"2004","Pages":null,"Year":"2004","Publisher":null},{"Type":null,"Title":"Status of coral reefs of the world: 2008","Journal":null,"Author":["Wilkinson, Clive","Network, Global Coral Reef Monitoring"],"Volume":null,"Issue":null,"Pages":null,"Year":"2008","Publisher":"Global Coral Reef Monitoring Network Townsville"},{"Type":null,"Title":"A second-generation current conveyor and its applications","Journal":"IEEE Transactions on Circuit Theory","Author":["Network, AOCCA","Cherry, E"],"Volume":null,"Issue":null,"Pages":"301-302","Year":"1970","Publisher":null}]';
                    setTimeout(function () {
                        _this.onSearchFinished(res);
                    }, 1000);
                    return;
                }
                var params = { "author": _this.txtAuthor.value, "phrase": _this.txtTitle.value };
                CTM.Utils.ajaxQuery(params, "QueryGoogleScholar", _this.onSearchFinished);
            };
            this.onSearchFinished = function (jsonText) {
                _this.divSearching.style.display = "none";
                var data = [];
                if (jsonText == "") {
                    return;
                }
                var jsonObj = $.parseJSON(jsonText);
                _this.showResult(jsonObj);
            };
            this.element = document.getElementById("searchInGoogleForm");
            this.divSearching = document.getElementById("searchInGoogleForm_searching");
            this.resultContainer = document.getElementById("resultContainer");
            this.txtTitle = document.getElementById("searchInGoogle_title");
            this.txtAuthor = document.getElementById("searchInGoogle_author");
            this.buttonSearch = document.getElementById("searchInGoogle_search");
            this.buttonBack = document.getElementById("searchInGoogle_back");
            this.buttonSearch.onclick = this.search;
            this.buttonBack.onclick = function () {
                _this.close();
            };
        }
        GoogleSearchUi.prototype.show = function () {
            this.txtTitle.value = "";
            this.txtAuthor.value = "";
            document.getElementById("mainUi").style.display = "none";
            this.element.style.display = "block";
            this.resultContainer.style.display = "none";
            this.divSearching.style.display = "none";
        };
        GoogleSearchUi.prototype.close = function () {
            this.element.style.display = "none";
            document.getElementById("mainUi").style.display = "block";
        };
        GoogleSearchUi.prototype.clearResult = function () {
            this.resultContainer.textContent = "";
        };
        GoogleSearchUi.prototype.createResultItem = function (refData) {
            var div = CTM.Utils.createElement("div", { "class": "searchResultItem" });
            var insertImg = CTM.Utils.createElement("img", { "class": "insertIcon", "src": "../Images/addSmall.png" });
            insertImg.onclick = function () {
                CTM.Utils.showMessage('Article "' + refData.title + '" is added to collection.');
                CTM.MainPageUi.refDataModel.addReference(refData.title, refData.author, refData.journal, refData.volume, refData.issue, refData.pages, refData.year, "");
                CTM.MainPageUi.refControl.setup();
            };
            div.appendChild(insertImg);
            var innerDiv = CTM.Utils.createElement("div", { "class": "searchResultItemInner" });
            innerDiv.appendChild(CTM.Utils.createElement("div", {
                "class": "searchResultRefTitle",
                "text": refData.title
            }));
            var detailInfo = document.createElement("div");
            detailInfo.appendChild(CTM.Utils.createElement("span", {
                "text": CTM.ReferenceItemFactory.handleAuthor(refData.author)
            }));
            if (refData.journal != null) {
                detailInfo.appendChild(CTM.Utils.createElement("span", {
                    "text": " - "
                }));
                detailInfo.appendChild(CTM.Utils.createElement("i", {
                    "text": refData.journal
                }));
            }
            if (refData.year != null) {
                detailInfo.appendChild(CTM.Utils.createElement("span", {
                    "text": ", "
                }));
                detailInfo.appendChild(CTM.Utils.createElement("span", {
                    "text": refData.year
                }));
            }
            innerDiv.appendChild(detailInfo);
            div.appendChild(innerDiv);
            div.appendChild(CTM.Utils.createElement("div", { "class": "clear" }));
            return div;
        };
        GoogleSearchUi.prototype.showResult = function (resList) {
            for (var i = 0; i < resList.length; i++) {
                var article = new CTM.Article();
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
                this.resultContainer.appendChild(this.createResultItem(article));
            }
            this.resultContainer.style.display = "block";
        };
        return GoogleSearchUi;
    })();
    CTM.GoogleSearchUi = GoogleSearchUi;
})(CTM || (CTM = {}));
(function () {
    $(document).ready(function () {
        var mainUi = new CTM.GoogleSearchUi();
    });
})();
//# sourceMappingURL=GoogleSearchUi.js.map