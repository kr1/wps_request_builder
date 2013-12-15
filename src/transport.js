/* global wpsBuilder */
(function (proto) {
    /**
     * sendQuery() sends an ajax call. it accepts the following params
     * @param {string} url
     * @param {string} payload
     * @param {function} successCallback
     * @param {object} options:
     *                     - trackLoading -> function, to visualize query progress
     *                     - errorCallback -> function
     *                     - completeCallback -> function
     * @returns {number} lastAjax
     */
    function sendQuery(url, payload, successCallback, options) {
        options = options || {};
        var ajaxSetup = {
            dataType: "json",
            url: url,
            success: successCallback
        };
        if (options.completeCallback) {
            ajaxSetup.complete = function () {
                options.completeCallback();
            };
        }
        if (options.errorCallback) {
            ajaxSetup.error = options.errorCallback;
        }
        if (options.trackLoading) {
            ajaxSetup.progress = options.trackLoading;
        }
        var req = new XMLHttpRequest();
        req.open("POST", ajaxSetup.url, true);
        req.onreadystatechange = function () {
            if (req.readyState !== 4 || req.status !== 200) {
                // TODO: implement error callback
                return;
            } else {
                //var data = (JSON.parse(req.responseText));
                ajaxSetup.success(req);
            }
        };
        req.send(payload);
        proto.currentAjax = req;
        return req;
    }
    proto._sendQuery = sendQuery;
})(typeof exports === "undefined" ?  wpsBuilder.transport = {} : exports);
