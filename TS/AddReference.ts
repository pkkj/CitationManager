module CTM {
    export class AddRefUi {
        public element: HTMLElement;
        public txtTitle: HTMLInputElement;
        public txtAuthor: HTMLInputElement;
        public txtJournal: HTMLInputElement;
        public txtYear: HTMLInputElement;
        public txtVolume: HTMLInputElement;
        public txtNumber: HTMLInputElement;
        public txtPages: HTMLInputElement;

        public buttonAdd: HTMLButtonElement;
        public buttonCancel: HTMLButtonElement;
        public buttonInject: HTMLButtonElement;
        constructor() {
            this.element = document.getElementById("addReferenceForm");
            this.txtTitle = <HTMLInputElement>document.getElementById("itemTitleText");
            this.txtAuthor = <HTMLInputElement>document.getElementById("itemAuthorText");
            this.txtJournal = <HTMLInputElement>document.getElementById("itemJournalText");
            this.txtYear = <HTMLInputElement>document.getElementById("itemYearText");
            this.txtVolume = <HTMLInputElement>document.getElementById("itemVolumeText");
            this.txtNumber = <HTMLInputElement>document.getElementById("itemNumberText");
            this.txtPages = <HTMLInputElement>document.getElementById("itemPageText");

            this.buttonAdd = <HTMLButtonElement>document.getElementById("addReferenceForm_addReference");
            this.buttonCancel = <HTMLButtonElement>document.getElementById("addReferenceForm_cancelAddReference");
            this.buttonInject = <HTMLButtonElement>document.getElementById("addReferenceForm_injectData");
            this.buttonAdd.onclick = () => {

                MainPageUi.refDataModel.addReference(this.txtTitle.value, this.txtAuthor.value, this.txtJournal.value, this.txtVolume.value, this.txtNumber.value, this.txtPages.value, this.txtYear.value, "");
                MainPageUi.refControl.setup();
                this.close();
            }
            this.buttonCancel.onclick = () => {
                this.close();
            }
            this.buttonInject.onclick = () => {
                this.injectData();
            }
        }

        static counter = 0;
        public injectData() {
            AddRefUi.counter++;
            var testData: Array<Article> = new Array<Article>();
            testData.push(Article.makeArticle(
                    1,
                    "Analysis of the airport network of India as a complex weighted network",
                    "Bagler, Ganesh",
                    "Physica A: Statistical Mechanics and its Applications",
                    "387",
                    "12",
                    "2972--2980",
                    "2008",
                    "Elsevier"));
            testData.push(Article.makeArticle(
                2,
                "A spatial analysis of FedEx and UPS: hubs, spokes, and network structure",
                "Bowen Jr., J. T.",
                "Journal of Transport Geography",
                "24",
                "2",
                "419-431",
                "2012",
                "Elsevier"));

            testData.push(Article.makeArticle(
                3,
                "Will China’s airline industry survive the entry of high-speed rail?",
                "Fu, Xiaowen ; Zhang, Anming ; Lei, Zheng",
                "Research in Transportation Economics",
                "35",
                "1",
                "13-25",
                "2012",
                "Elsevier"));
            testData.push(Article.makeArticle(
                4,
                "Exploring the network structure and nodal centrality of China’s air transport network: A complex network approach",
                "Wang, Jiaoe ; Mo, Huihui ; Wang, Fahui ; Jin, Fengjun",
                "Journal of Transport Geograph",
                "19",
                "4",
                "713-725",
                "2011",
                "Elsevier"));
            var i = AddRefUi.counter % testData.length;
            this.txtTitle.value = testData[i].title;
            this.txtAuthor.value = testData[i].author;
            this.txtJournal.value = testData[i].journal;
            this.txtVolume.value = testData[i].volume;
            this.txtNumber.value = testData[i].issue;
            this.txtPages.value = testData[i].pages;
            this.txtYear.value = testData[i].year;
        }


        public show() {
            this.txtTitle.value = "";
            this.txtAuthor.value = "";
            this.txtJournal.value = "";
            this.txtVolume.value = "";
            this.txtNumber.value = "";
            this.txtPages.value = "";
            this.txtYear.value = "";
            document.getElementById("mainUi").style.display = "none";
            this.element.style.display = "block";

        }

        public close() {
            this.element.style.display = "none";
            document.getElementById("mainUi").style.display = "block";
        }
    }
} 