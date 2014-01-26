(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(function () {return root.wpsBuilder = factory ()});
    } else {
        // Browser globals
        root.wpsBuilder = factory();
    }
}(this, function (exports) {
    ___code_here___
    return exports
}));
