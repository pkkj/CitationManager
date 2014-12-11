var CTM;
(function (CTM) {
    var CollapseItem = (function () {
        function CollapseItem(divRoot, divA, divB, params) {
            var _this = this;
            this.divRoot = null;
            this.tableRef = null;
            this.width = 250;
            this.height = 20;
            this.metaData = "";
            this.divRoot = divRoot;
            this.divA = divA;
            this.divB = divB;
            this.width = 250;
            this.height = 20;
            if (params) {
                this.width = params.width ? params.width : this.width;
                this.height = params.height ? params.height : this.height;
            }
            divB.style.display = "none";
            this.ddTitle = document.createElement("div");
            this.ddTitle.className = "collapseTitle";
            this.ddTitle.style.width = this.width.toString() + "px";
            this.ddTitle.style.height = this.height.toString() + "px";
            var ddTitleDivider = document.createElement("span");
            ddTitleDivider.className = "collapseTitleDivider";
            var ddDividerArrow = document.createElement("span");
            ddDividerArrow.className = "collapseTitleDividerArrow";
            this.ddTitleText = document.createElement("span");
            this.ddTitleText.className = "collapseTitleText";
            this.ddTitleText.appendChild(divA);
            this.ddTitle.appendChild(ddTitleDivider);
            this.ddTitle.appendChild(ddDividerArrow);
            this.ddTitle.appendChild(this.ddTitleText);
            divRoot.appendChild(this.ddTitle);
            divRoot.appendChild(this.divB);
            divB.style.width = this.width.toString() + "px";
            this.ddTitle.onclick = function () {
                if (_this.tableRef) {
                    _this.tableRef.activeItem(_this);
                }
            };
            this.divB.id = "div" + CTM.Utils.guid();
        }
        CollapseItem.prototype.toggle = function () {
            if (this.divB.style.display == "none")
                this.divB.style.display = "block";
            else
                this.divB.style.display = "none";
        };
        CollapseItem.prototype.collapse = function () {
            //this.divB.style.display = "none";
            $("#" + this.divB.id).slideUp();
        };
        CollapseItem.prototype.show = function () {
            $("#" + this.divB.id).slideDown();
            //this.divB.style.display = "block";
        };
        return CollapseItem;
    })();
    CTM.CollapseItem = CollapseItem;
    var CollapseTable = (function () {
        function CollapseTable(divRoot, params) {
            this.currentActiveItem = null;
            this.header = null;
            this.width = 250;
            this.divRoot = divRoot;
            if (params) {
                this.width = params.width ? params.width : this.width;
            }
            this.items = new Array();
        }
        CollapseTable.prototype.addHeader = function (header) {
            this.header = header;
        };
        CollapseTable.prototype.addItem = function (item) {
            this.divRoot.appendChild(item.divRoot);
            this.divRoot.appendChild(this.createHDivider());
            item.tableRef = this;
            this.items.push(item);
        };
        CollapseTable.prototype.activeItem = function (item) {
            if (this.currentActiveItem) {
                this.currentActiveItem.collapse();
            }
            if (this.currentActiveItem == item) {
                this.currentActiveItem = null;
                return;
            }
            this.currentActiveItem = item;
            item.show();
        };
        CollapseTable.prototype.showItem = function (item) {
            if (this.currentActiveItem == item)
                return;
            if (this.currentActiveItem) {
                this.currentActiveItem.collapse();
            }
            this.currentActiveItem = item;
            item.show();
        };
        CollapseTable.prototype.clear = function () {
            while (this.divRoot.firstChild) {
                this.divRoot.removeChild(this.divRoot.firstChild);
            }
            if (this.header) {
                this.divRoot.appendChild(this.createHDivider());
                this.divRoot.appendChild(this.header);
                this.divRoot.appendChild(this.createHDivider());
            }
        };
        CollapseTable.prototype.createHDivider = function () {
            return CTM.Utils.createElement("div", { "class": "collapseTableItemHBorder", "width": (this.width + 2).toString() + "px" });
        };
        return CollapseTable;
    })();
    CTM.CollapseTable = CollapseTable;
    var ReferenceControl = (function () {
        function ReferenceControl(rootElement) {
            this.defaultTableWidth = 390;
            this.rootElement = rootElement;
        }
        ReferenceControl.prototype.setup = function () {
            this.rootElement.innerHTML = "";
            if (this.data.listArticle.length == 0) {
                this.rootElement.innerHTML = "<div style='color: #909090; font-weight: 600; font-size: 27pt; margin: 10px'>No data in collection</div>";
                return;
            }
            this.tableControl = new CollapseTable(this.rootElement, { "width": this.defaultTableWidth });
            this.tableControl.clear();
            for (var i = 0; i < this.data.listArticle.length; i++) {
                this.addReference(this.data.listArticle[i]);
            }
        };
        ReferenceControl.prototype.addReference = function (ref) {
            var itemRoot = document.createElement("div");
            var divAInner = CTM.Utils.createElement("div", {
                "class": "collapseItemAInner refTitle",
                "text": ref.title,
                "width": (this.defaultTableWidth - 50).toString() + "px"
            });
            var divA = document.createElement("div");
            divA.appendChild(divAInner);
            // Make div B
            var paperInfo = document.createElement("div");
            paperInfo.appendChild(CTM.Utils.createElement("span", {
                "text": "Author: ",
                "class": "refItemInnerTitle"
            }));
            paperInfo.appendChild(CTM.Utils.createElement("span", {
                "text": CTM.ReferenceItemFactory.handleAuthor(ref.author)
            }));
            paperInfo.appendChild(document.createElement("br"));
            if (ref.journal != null) {
                paperInfo.appendChild(CTM.Utils.createElement("span", {
                    "text": "Jounral: ",
                    "class": "refItemInnerTitle"
                }));
                paperInfo.appendChild(CTM.Utils.createElement("span", {
                    "text": ref.journal
                }));
                paperInfo.appendChild(document.createElement("br"));
            }
            paperInfo.appendChild(CTM.Utils.createElement("span", {
                "text": "Year: ",
                "class": "refItemInnerTitle"
            }));
            paperInfo.appendChild(CTM.Utils.createElement("span", {
                "text": ref.year
            }));
            paperInfo.appendChild(document.createElement("br"));
            if (ref.volume != null) {
                paperInfo.appendChild(CTM.Utils.createElement("span", {
                    "text": "Volume: ",
                    "class": "refItemInnerTitle"
                }));
                paperInfo.appendChild(CTM.Utils.createElement("span", {
                    "text": ref.volume
                }));
                paperInfo.appendChild(document.createElement("br"));
            }
            if (ref.issue != null) {
                paperInfo.appendChild(CTM.Utils.createElement("span", {
                    "text": "Number: ",
                    "class": "refItemInnerTitle"
                }));
                paperInfo.appendChild(CTM.Utils.createElement("span", {
                    "text": ref.issue
                }));
                paperInfo.appendChild(document.createElement("br"));
            }
            var controlButtons = document.createElement("div");
            var citeButton = CTM.Utils.createElement("button", { "text": "Insert" });
            citeButton.onclick = function () {
                ref.insertCitation();
            };
            var removeButton = CTM.Utils.createElement("button", { "text": "Remove" });
            removeButton.onclick = function () {
                ref.removeCitation();
            };
            var gotoButton = CTM.Utils.createElement("button", { "text": "Goto" });
            gotoButton.onclick = function () {
                ref.goto();
            };
            var delButton = CTM.Utils.createElement("button", { "text": "Delete" });
            delButton.onclick = function () {
                ref.delete();
            };
            controlButtons.appendChild(citeButton);
            controlButtons.appendChild(CTM.Utils.createElement("span", { "text": "&nbsp;&nbsp;&nbsp;" }));
            controlButtons.appendChild(removeButton);
            controlButtons.appendChild(CTM.Utils.createElement("span", { "text": "&nbsp;&nbsp;&nbsp;" }));
            controlButtons.appendChild(gotoButton);
            controlButtons.appendChild(CTM.Utils.createElement("span", { "text": "&nbsp;&nbsp;&nbsp;" }));
            controlButtons.appendChild(delButton);
            var divBInner = CTM.Utils.createElement("div", { "class": "collapseItemBInner" });
            divBInner.appendChild(paperInfo);
            divBInner.appendChild(CTM.Utils.createElement("div", { "height": "5px" }));
            divBInner.appendChild(controlButtons);
            var divB = CTM.Utils.createElement("div", { "class": "collapseItemB" });
            divB.appendChild(divBInner);
            var item = new CTM.CollapseItem(itemRoot, divA, divB, { "height": 48, "width": this.defaultTableWidth });
            item.metaData = ref.index;
            this.tableControl.addItem(item);
        };
        ReferenceControl.prototype.showItem = function (articleIndex) {
            for (var i = 0; i < this.tableControl.items.length; i++) {
                if (this.tableControl.items[i].metaData == articleIndex) {
                    this.tableControl.showItem(this.tableControl.items[i]);
                }
            }
        };
        return ReferenceControl;
    })();
    CTM.ReferenceControl = ReferenceControl;
})(CTM || (CTM = {}));
(function () {
})();
//# sourceMappingURL=CollapseTable.js.map