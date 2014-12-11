var CTM;
(function (CTM) {
    var MainPageUi = (function () {
        function MainPageUi() {
        }
        MainPageUi.prototype.setup = function () {
            // Setup other UI
            this.addRefUi = new CTM.AddRefUi();
            this.googleSearchUi = new CTM.GoogleSearchUi();
            this.initiateRefList();
            this.setupEvent();
        };
        MainPageUi.prototype.setupEvent = function () {
            var _this = this;
            $("#addReference").click(function () {
                _this.addRefUi.show();
            });
            $("#generateIndex").click(function () {
                var html = MainPageUi.refDataModel.generateReferenceTable();
                Office.context.document.setSelectedDataAsync(html, { coercionType: "html" }, function (asyncResult) {
                    _this.showMessage("Reference table inserted.");
                });
            });
            $("#saveRef").click(function () {
                MainPageUi.refDataModel.saveToSetting();
            });
            $('#toastMessage .closeBtn').click(function () {
                $('#toastMessage').hide();
            });
            $("#googleReference").click(function () {
                _this.googleSearchUi.show();
            });
        };
        MainPageUi.prototype.showMessage = function (message) {
            setTimeout(function () {
                $("#toastMessage").slideUp();
            }, 3000);
            $("#message").text(message);
            $("#toastMessage").slideDown("fast");
        };
        MainPageUi.prototype.initiateRefList = function () {
            MainPageUi.refDataModel = new CTM.RefDataModel();
            MainPageUi.refDataModel.loadSetting();
            //MainPageUi.refDataModel.loadTestingRef();
            MainPageUi.refControl = new CTM.ReferenceControl(document.getElementById("refTable"));
            MainPageUi.refControl.data = MainPageUi.refDataModel;
            MainPageUi.refControl.setup();
        };
        return MainPageUi;
    })();
    CTM.MainPageUi = MainPageUi;
})(CTM || (CTM = {}));
(function () {
    Office.initialize = function (reason) {
        $(document).ready(function () {
            var mainUi = new CTM.MainPageUi();
            mainUi.setup();
        });
    };
})();
//# sourceMappingURL=App.js.map