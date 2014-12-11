var CTM;
(function (CTM) {
    var AddRefUi = (function () {
        function AddRefUi() {
            var _this = this;
            this.element = document.getElementById("addReferenceForm");
            this.txtTitle = document.getElementById("itemTitleText");
            this.txtAuthor = document.getElementById("itemAuthorText");
            this.txtJournal = document.getElementById("itemJournalText");
            this.txtYear = document.getElementById("itemYearText");
            this.txtVolume = document.getElementById("itemVolumeText");
            this.txtNumber = document.getElementById("itemNumberText");
            this.txtPages = document.getElementById("itemPageText");
            this.buttonAdd = document.getElementById("addReferenceForm_addReference");
            this.buttonCancel = document.getElementById("addReferenceForm_cancelAddReference");
            this.buttonInject = document.getElementById("addReferenceForm_injectData");
            this.buttonAdd.onclick = function () {
                CTM.MainPageUi.refDataModel.addReference(_this.txtTitle.value, _this.txtAuthor.value, _this.txtJournal.value, _this.txtVolume.value, _this.txtNumber.value, _this.txtPages.value, _this.txtYear.value, "");
                CTM.MainPageUi.refControl.setup();
                _this.close();
            };
            this.buttonCancel.onclick = function () {
                _this.close();
            };
            this.buttonInject.onclick = function () {
                _this.injectData();
            };
        }
        AddRefUi.prototype.injectData = function () {
            AddRefUi.counter++;
            var testData = new Array();
            testData.push(CTM.Article.makeArticle(1, "Analysis of the airport network of India as a complex weighted network", "Bagler, Ganesh", "Physica A: Statistical Mechanics and its Applications", "387", "12", "2972--2980", "2008", "Elsevier"));
            testData.push(CTM.Article.makeArticle(2, "A spatial analysis of FedEx and UPS: hubs, spokes, and network structure", "Bowen Jr., J. T.", "Journal of Transport Geography", "24", "2", "419-431", "2012", "Elsevier"));
            testData.push(CTM.Article.makeArticle(3, "Will China’s airline industry survive the entry of high-speed rail?", "Fu, Xiaowen ; Zhang, Anming ; Lei, Zheng", "Research in Transportation Economics", "35", "1", "13-25", "2012", "Elsevier"));
            testData.push(CTM.Article.makeArticle(4, "Exploring the network structure and nodal centrality of China’s air transport network: A complex network approach", "Wang, Jiaoe ; Mo, Huihui ; Wang, Fahui ; Jin, Fengjun", "Journal of Transport Geograph", "19", "4", "713-725", "2011", "Elsevier"));
            var i = AddRefUi.counter % testData.length;
            this.txtTitle.value = testData[i].title;
            this.txtAuthor.value = testData[i].author;
            this.txtJournal.value = testData[i].journal;
            this.txtVolume.value = testData[i].volume;
            this.txtNumber.value = testData[i].issue;
            this.txtPages.value = testData[i].pages;
            this.txtYear.value = testData[i].year;
        };
        AddRefUi.prototype.show = function () {
            this.txtTitle.value = "";
            this.txtAuthor.value = "";
            this.txtJournal.value = "";
            this.txtVolume.value = "";
            this.txtNumber.value = "";
            this.txtPages.value = "";
            this.txtYear.value = "";
            document.getElementById("mainUi").style.display = "none";
            this.element.style.display = "block";
        };
        AddRefUi.prototype.close = function () {
            this.element.style.display = "none";
            document.getElementById("mainUi").style.display = "block";
        };
        AddRefUi.counter = 0;
        return AddRefUi;
    })();
    CTM.AddRefUi = AddRefUi;
})(CTM || (CTM = {}));
//# sourceMappingURL=AddReference.js.map