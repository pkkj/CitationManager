var CTM;
(function (CTM) {
    var Article = (function () {
        function Article() {
            this.bindingList = new Array();
            this.bindingNavIndex = 0;
            this.bindingCounter = 0;
        }
        Article.makeArticle = function (index, title, author, journal, volume, issue, pages, year, publisher) {
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
        };
        Article.prototype.resolveBinding = function (onFinished) {
            var _this = this;
            if (this.bindingList.length == 0) {
                if (onFinished) {
                    onFinished();
                }
                return;
            }
            var validBinding = [];
            var finishedCount = 0;
            for (var i = 0; i < this.bindingList.length; i++) {
                Office.context.document.bindings.getByIdAsync(this.bindingList[i], function (asyncResult) {
                    finishedCount++;
                    if (asyncResult.status == "failed") {
                    }
                    else {
                        validBinding.push(asyncResult.value.id);
                    }
                    if (finishedCount == _this.bindingList.length) {
                        _this.bindingList = validBinding;
                        if (onFinished)
                            onFinished();
                    }
                });
            }
        };
        Article.prototype.insertCitation = function () {
            var _this = this;
            var bindingName = "cite_" + this.bindingCounter + "_" + this.index;
            this.bindingCounter++;
            Office.context.document.setSelectedDataAsync(InDocumentCitationFactory.instance().create(this), { coercionType: "html" }, function (asyncResult1) {
                Office.context.document.bindings.addFromSelectionAsync(Office.BindingType.Text, { id: bindingName }, function (asyncResult2) {
                    _this.bindingList.push(bindingName);
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
                    CTM.Utils.showMessage("Citation inserted");
                });
            });
        };
        Article.prototype.goto = function () {
            var _this = this;
            this.resolveBinding(function () {
                if (_this.bindingList.length == 0) {
                    CTM.Utils.showMessage("No citation inserted yet");
                    return;
                }
                if (_this.bindingNavIndex >= _this.bindingList.length) {
                    _this.bindingNavIndex = 0;
                }
                var nextBinding = _this.bindingList[_this.bindingNavIndex];
                Office.context.document.goToByIdAsync(nextBinding, Office.GoToType.Binding, function (asyncResult) {
                    _this.bindingNavIndex++;
                    if (asyncResult.status == "failed") {
                        CTM.Utils.showMessage("Action failed with error: " + asyncResult.error.message);
                    }
                    else {
                        CTM.Utils.showMessage("Navigation successful");
                    }
                });
            });
        };
        Article.prototype.removeCitation = function (callback) {
            var _this = this;
            if (callback === void 0) { callback = null; }
            this.resolveBinding(function () {
                var bindingCount = _this.bindingList.length;
                if (bindingCount == 0) {
                    if (callback != null)
                        callback();
                    return;
                }
                var removedCount1 = 0;
                for (var i = 0; i < _this.bindingList.length; i++) {
                    Office.select("bindings#" + _this.bindingList[i]).setDataAsync("", function (asyncResult1) {
                        removedCount1++;
                        if (removedCount1 == bindingCount) {
                            var removedCount2 = 0;
                            for (var j = 0; j < _this.bindingList.length; j++) {
                                Office.context.document.bindings.releaseByIdAsync(_this.bindingList[j], function (asyncResult2) {
                                    if (asyncResult2.status == "failed") {
                                        CTM.Utils.showMessage("Action failed with error: " + asyncResult2.error.message);
                                    }
                                    else {
                                        CTM.Utils.showMessage("Citation removed.");
                                    }
                                    removedCount2++;
                                    if (removedCount2 == bindingCount) {
                                        _this.bindingList = [];
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
        };
        Article.prototype.delete = function () {
            var _this = this;
            var onCitationRemoved = function () {
                // Notify the dataModel: remove itself from the list
                CTM.MainPageUi.refDataModel.removeReference(_this.index);
                // Refresh the table.
                CTM.MainPageUi.refControl.setup();
            };
            // Remove all the citation
            this.removeCitation(onCitationRemoved);
        };
        return Article;
    })();
    CTM.Article = Article;
    var InDocumentCitationFactory = (function () {
        function InDocumentCitationFactory() {
        }
        InDocumentCitationFactory.prototype.create = function (item) {
            var s = "";
            s = InDocumentCitationFactory.handleAuthor(item.author) + ", " + item.year;
            s = "(" + s + ")";
            return s;
        };
        InDocumentCitationFactory.instance = function () {
            if (InDocumentCitationFactory._instance == null) {
                InDocumentCitationFactory._instance = new InDocumentCitationFactory();
            }
            return InDocumentCitationFactory._instance;
        };
        InDocumentCitationFactory.handleAuthor = function (authors) {
            var authorList = authors.split(";");
            var res = "";
            if (authorList.length == 1) {
                res = authorList[0].trim();
            }
            else if (authorList.length == 2) {
                res = authorList[0].trim() + " and " + authorList[1].trim();
            }
            else {
                res = authorList[0].trim() + " and " + authorList[1].trim() + ", et al";
            }
            return res;
        };
        return InDocumentCitationFactory;
    })();
    CTM.InDocumentCitationFactory = InDocumentCitationFactory;
    var ReferenceItemFactory = (function () {
        function ReferenceItemFactory() {
        }
        ReferenceItemFactory.prototype.create = function (item) {
            var element = document.createElement("span");
            var s;
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
            }
            else {
                s = s.replace(": %PAGES%", "");
            }
            element.appendChild(CTM.Utils.createElement("span", { "text": s }));
            return element.innerHTML;
        };
        ReferenceItemFactory.handleAuthor = function (authors) {
            var authorList = authors.split(";");
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
        };
        ReferenceItemFactory.instance = function () {
            if (ReferenceItemFactory._instance == null) {
                ReferenceItemFactory._instance = new ReferenceItemFactory();
            }
            return ReferenceItemFactory._instance;
        };
        return ReferenceItemFactory;
    })();
    CTM.ReferenceItemFactory = ReferenceItemFactory;
    var ApaReferenceItemFactory = (function () {
        function ApaReferenceItemFactory() {
        }
        ApaReferenceItemFactory.prototype.create = function (item) {
            var element = document.createElement("span");
            var s;
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
            }
            else {
                s = s.replace(", %PAGES%", "");
            }
            element.appendChild(CTM.Utils.createElement("span", { "text": s }));
            return element.innerHTML;
        };
        ApaReferenceItemFactory.handleAuthor = function (authors) {
            var authorList = authors.split(";");
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
        };
        ApaReferenceItemFactory.instance = function () {
            if (ApaReferenceItemFactory._instance == null) {
                ApaReferenceItemFactory._instance = new ApaReferenceItemFactory();
            }
            return ApaReferenceItemFactory._instance;
        };
        return ApaReferenceItemFactory;
    })();
    CTM.ApaReferenceItemFactory = ApaReferenceItemFactory;
    var ChicagoReferenceItemFactory = (function () {
        function ChicagoReferenceItemFactory() {
        }
        ChicagoReferenceItemFactory.prototype.create = function (item) {
            var element = document.createElement("span");
            var s;
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
            }
            else {
                s = s.replace(": %PAGES%", "");
            }
            element.appendChild(CTM.Utils.createElement("span", { "text": s }));
            return element.innerHTML;
        };
        ChicagoReferenceItemFactory.instance = function () {
            if (ChicagoReferenceItemFactory._instance == null) {
                ChicagoReferenceItemFactory._instance = new ChicagoReferenceItemFactory();
            }
            return ChicagoReferenceItemFactory._instance;
        };
        return ChicagoReferenceItemFactory;
    })();
    CTM.ChicagoReferenceItemFactory = ChicagoReferenceItemFactory;
})(CTM || (CTM = {}));
//# sourceMappingURL=Data.js.map