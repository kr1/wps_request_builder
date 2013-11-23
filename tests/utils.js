// Define a walk_the_DOM function that visits every
// node of the tree in HTML source order, starting
// from some given node. It invokes a function,
// passing it each node in turn. walk_the_DOM calls
// itself to process each of the child nodes.
var walk_the_DOM = function walk(node, func) {
    func(node);
    node = node.firstChild;
    while (node) {
        walk(node, func);
        node = node.nextSibling;
    }
};

call_geo_server = function (docstring) {
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
