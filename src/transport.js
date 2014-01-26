/*jshint -W015 */

    exports.transport = {};

    /**
     * sendQuery() sends an ajax call. it accepts the following params
     * @param {string} url
     * @param {string} payload
     * @param {function} successCallback
     * @param {object} options:
     *                     - errorCallback -> function
     *                     - completeCallback -> function
     * @returns {number} lastAjax
     */
    exports.transport._sendQuery = function (url, payload, successCallback, options) {
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
        exports.transport.currentAjax = req;
        return req;
    };
