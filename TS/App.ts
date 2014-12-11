module CTM {
 
    export class MainPageUi {
        // Data Model
        static refControl: ReferenceControl;
        static refDataModel: RefDataModel;
        public addRefUi: AddRefUi;
        public googleSearchUi: GoogleSearchUi;
        constructor() {
        }

        public setup() {
            // Setup other UI
            this.addRefUi = new AddRefUi();
            this.googleSearchUi = new GoogleSearchUi();
            this.initiateRefList();
            this.setupEvent();
        }


        public setupEvent() {
            $("#addReference").click(() => {
                this.addRefUi.show();

            });
            $("#generateIndex").click(() => {
                var html = MainPageUi.refDataModel.generateReferenceTable();
                Office.context.document.setSelectedDataAsync(html, { coercionType: "html" }, (asyncResult) => {
                    this.showMessage("Reference table inserted.");

                });
            });

            $("#saveRef").click(() => {
                MainPageUi.refDataModel.saveToSetting();
            });
            $('#toastMessage .closeBtn').click(function () {
                $('#toastMessage').hide();
            });

            $("#googleReference").click(() => {
                this.googleSearchUi.show();
            });
        }
        public showMessage(message: string) {
            setTimeout(function () {
                $("#toastMessage").slideUp();
            }, 3000);
            $("#message").text(message);
            $("#toastMessage").slideDown("fast");
        }

        public initiateRefList() {
            MainPageUi.refDataModel = new CTM.RefDataModel();
            MainPageUi.refDataModel.loadSetting();
            //MainPageUi.refDataModel.loadTestingRef();
            MainPageUi.refControl = new CTM.ReferenceControl(document.getElementById("refTable"));
            MainPageUi.refControl.data = MainPageUi.refDataModel;
            MainPageUi.refControl.setup();
        }
    }
}


(function () {
    Office.initialize = function (reason) {
        $(document).ready(function () {
            var mainUi = new CTM.MainPageUi();

            mainUi.setup();

        });
    };
})();
