(function (exports) {
    // Define a walk_the_DOM function that visits every
    // node of the tree in HTML source order, starting
    // from some given node. It invokes a function,
    // passing it each node in turn. walk_the_DOM calls
    // itself to process each of the child nodes.
    exports.walk_the_DOM = function walk(node, func) {
        func(node);
        node = node.firstChild;
        while (node) {
            walk(node, func);
            node = node.nextSibling;
        }
    };


    exports.compare_nodes = function (node1, node2) {
        var string1 = vkbeautify.xml(typeof(node1) == "string" ? node1 : wpsBuilder.serialize(node1));
        var string2 = vkbeautify.xml(typeof(node2) == "string" ? node2 : wpsBuilder.serialize(node2));
        var equal = EquivalentXml.isEquivalent(string1, string2)
        if (!equal) {
            exports.displayNodeStrings(string1, string2);
            equal = string1 == string2;
            console.log("Warning: only stringcompare:", equal);
        }

        return equal
    }

    exports.displayNodeStrings = function (str1, str2) {
        document.getElementById("left_code").innerText = str1;
        document.getElementById("right_code").innerText = str2;
    }

    exports.call_geo_server = function (docstring) {
        var r = new XMLHttpRequest(),
            data;
        r.open("POST", "http://localhost:8888/geoserver/wps/", true);
        r.onreadystatechange = function () {
            if (r.readyState != 4 || r.status != 200) return; 
            res = r;
            console.log(r.responseText);
        };
        if (docstring.slice(0,5) == "<?xml") {
            data = docstring;
        } else {
            data = "<?xml version='1.0' encoding='UTF-8'?>" + docstring;
        }
        r.send(data);
    }
})(typeof(exports) === "undefined" ? this.wpsBuilder.tests.utils = {} : exports)
