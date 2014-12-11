var CTM;
(function (CTM) {
    var Utils = (function () {
        function Utils() {
        }
        // Event helper functions
        Utils.addEvent = function (element, evnt, funct) {
            if (element.attachEvent)
                element.attachEvent('on' + evnt, funct);
            else
                element.addEventListener(evnt, funct, false);
        };
        // Formatting helper functions
        Utils.createElement = function (element, params) {
            var dom = document.createElement(element);
            if (params != null) {
                dom.style.width = params["width"] ? params["width"] : dom.style.width;
                dom.style.height = params["height"] ? params["height"] : dom.style.height;
                if (params["colSpan"]) {
                    dom.colSpan = params["colSpan"];
                }
                if (params["rowSpan"]) {
                    dom.rowSpan = params["rowSpan"];
                }
                dom.style.lineHeight = params["lineHeight"] ? params["lineHeight"] : dom.style.lineHeight;
                dom.style.cssFloat = params["float"] ? params["float"] : dom.style.cssFloat;
                dom.className = params["class"] ? params["class"] : "";
                if (element != "table" && element != "tr" && element != "iframe") {
                    dom.innerHTML = params["text"] ? params["text"] : "";
                }
                if (params["id"]) {
                    dom.setAttribute("id", params["id"]);
                }
                if (params["type"]) {
                    dom.setAttribute("type", params["type"]);
                }
                if (params["src"]) {
                    dom.setAttribute("src", params["src"]);
                }
            }
            return dom;
        };
        Utils.ajaxQuery = function (params, func, callback) {
            /// Function that handles the returned AJAX request
            var onRequestStatusChange = function () {
                if (httpRequest.readyState == 4) {
                    var succussRequest = false;
                    try {
                        switch (httpRequest.status) {
                            case 200:
                                succussRequest = true;
                                break;
                            default:
                                break;
                        }
                    }
                    catch (err) {
                        err;
                    }
                    if (succussRequest) {
                        var xDoc = httpRequest.responseXML;
                        try {
                            var jsonMsg = "";
                            for (var i = 0; i < xDoc.getElementsByTagName('string')[0].childNodes.length; i++) {
                                jsonMsg += xDoc.getElementsByTagName('string')[0].childNodes[i].nodeValue;
                            }
                            if (callback)
                                callback(jsonMsg);
                        }
                        catch (e) {
                            e;
                        }
                    }
                    httpRequest = null;
                }
            };
            var httpRequest = new XMLHttpRequest();
            httpRequest.onreadystatechange = onRequestStatusChange;
            //httpRequest.timeout = 25000;
            var url = "../Google.asmx/" + func;
            httpRequest.open("POST", url, true);
            httpRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            var requestData = "";
            for (var key in params) {
                if (requestData != "")
                    requestData += "&";
                requestData += key + "=" + params[key];
            }
            httpRequest.send(requestData);
            return httpRequest;
        };
        Utils.showMessage = function (message) {
            setTimeout(function () {
                $("#toastMessage").slideUp();
            }, 3000);
            $("#message").text(message);
            $("#toastMessage").slideDown("fast");
        };
        Utils.guid = function () {
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
            }
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
        };
        return Utils;
    })();
    CTM.Utils = Utils;
})(CTM || (CTM = {}));
//# sourceMappingURL=Utils.js.map