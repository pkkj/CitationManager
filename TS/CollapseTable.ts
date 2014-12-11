module CTM {
    export interface CollapseItemOptions {
        width?: number;
        height?: number;
    }
    export class CollapseItem {
        public divRoot: HTMLElement = null;
        public tableRef: CollapseTable = null;
        private divA: HTMLElement;
        private divB: HTMLElement;
        private ddTitle: HTMLElement;
        private ddTitleText: HTMLSpanElement;
        private width = 250;
        private height = 20;
        public metaData = "";
        constructor(divRoot: HTMLElement, divA: HTMLElement, divB: HTMLElement, params: CollapseItemOptions) {
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
            this.ddTitle.onclick = () => {
                if (this.tableRef) {
                    this.tableRef.activeItem(this);
                }
            };
            this.divB.id = "div" + Utils.guid();
        }
        toggle() {
            if (this.divB.style.display == "none")
                this.divB.style.display = "block";
            else
                this.divB.style.display = "none";
        }
        collapse() {
            //this.divB.style.display = "none";
            $("#" + this.divB.id).slideUp();
        }
        show() {

            $("#" + this.divB.id).slideDown();
            //this.divB.style.display = "block";
        }
    }
    export interface CollapseTableOptions {
        width?: number;
    }
    export class CollapseTable {
        public divRoot: HTMLElement;
        public items: Array<CollapseItem>;
        private currentActiveItem: CollapseItem = null;
        private header: HTMLElement = null;
        private width = 250;
        constructor(divRoot: HTMLElement, params: CollapseTableOptions) {
            this.divRoot = divRoot;
            if (params) {
                this.width = params.width ? params.width : this.width;
            }
            this.items = new Array<CollapseItem>();
        }
        addHeader(header: HTMLElement) {
            this.header = header;
        }
        addItem(item: CollapseItem) {
            this.divRoot.appendChild(item.divRoot);
            this.divRoot.appendChild(this.createHDivider());
            item.tableRef = this;
            this.items.push(item);
        }
        activeItem(item: CollapseItem) {
            if (this.currentActiveItem) {
                this.currentActiveItem.collapse();
            }
            if (this.currentActiveItem == item) {
                this.currentActiveItem = null;
                return;
            }
            this.currentActiveItem = item;
            item.show();
        }
        showItem(item: CollapseItem) {
            if (this.currentActiveItem == item)
                return;
            if (this.currentActiveItem) {
                this.currentActiveItem.collapse();
            }
            this.currentActiveItem = item;
            item.show();
        }
        clear() {
            while (this.divRoot.firstChild) {
                this.divRoot.removeChild(this.divRoot.firstChild);
            }
            if (this.header) {
                this.divRoot.appendChild(this.createHDivider());
                this.divRoot.appendChild(this.header);
                this.divRoot.appendChild(this.createHDivider());
            }
        }
        createHDivider() {
            return Utils.createElement("div", { "class": "collapseTableItemHBorder", "width": (this.width + 2).toString() + "px" });
        }
    }

    export class ReferenceControl {

        private rootElement: HTMLElement;
        private tableControl: CollapseTable;

        private defaultTableWidth = 390;

        // Reference data model
        public data: RefDataModel;
        constructor(rootElement: HTMLElement) {
            this.rootElement = rootElement;
        }

        public setup() {
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
        }

        public addReference(ref: Article) {
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
            paperInfo.appendChild(Utils.createElement("span", {
                "text": "Author: ", "class": "refItemInnerTitle"
            }));
            paperInfo.appendChild(Utils.createElement("span", {
                "text": ReferenceItemFactory.handleAuthor(ref.author)
            }));
            paperInfo.appendChild(document.createElement("br"));

            if (ref.journal != null) {
                paperInfo.appendChild(Utils.createElement("span", {
                    "text": "Jounral: ", "class": "refItemInnerTitle"
                }));
                paperInfo.appendChild(Utils.createElement("span", {
                    "text": ref.journal
                }));
                paperInfo.appendChild(document.createElement("br"));
            }

            paperInfo.appendChild(Utils.createElement("span", {
                "text": "Year: ", "class": "refItemInnerTitle"
            }));
            paperInfo.appendChild(Utils.createElement("span", {
                "text": ref.year
            }));
            paperInfo.appendChild(document.createElement("br"));

            if (ref.volume != null) {
                paperInfo.appendChild(Utils.createElement("span", {
                    "text": "Volume: ", "class": "refItemInnerTitle"
                }));
                paperInfo.appendChild(Utils.createElement("span", {
                    "text": ref.volume
                }));
                paperInfo.appendChild(document.createElement("br"));
            }

            if (ref.issue != null) {
                paperInfo.appendChild(Utils.createElement("span", {
                    "text": "Number: ", "class": "refItemInnerTitle"
                }));
                paperInfo.appendChild(Utils.createElement("span", {
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
            controlButtons.appendChild(Utils.createElement("span", { "text": "&nbsp;&nbsp;&nbsp;" }));
            controlButtons.appendChild(removeButton);
            controlButtons.appendChild(Utils.createElement("span", { "text": "&nbsp;&nbsp;&nbsp;" }));
            controlButtons.appendChild(gotoButton);
            controlButtons.appendChild(Utils.createElement("span", { "text": "&nbsp;&nbsp;&nbsp;" }));
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
        }

        public showItem(articleIndex: string) {
            for (var i = 0; i < this.tableControl.items.length; i++) {
                if (this.tableControl.items[i].metaData == articleIndex) {
                    this.tableControl.showItem(this.tableControl.items[i]);
                }
            }
        }
    }
}

(function () {

})();

