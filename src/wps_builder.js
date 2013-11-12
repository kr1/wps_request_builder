(function (exports) {

exports.make_execute_document = function() {
    exports.docu = new DOMParser().parseFromString('<xml></xml>',  "application/xml"),
    exports.exec = exports.docu.createElementNS("http://www.opengis.net/wps/1.0.0", "wps:Execute");
    exports.exec.setAttributeNS( "http://www.w3.org/2001/XMLSchema-instance", "xsi:schemaLocation","http://www.opengis.net/wps/1.0.0 http://schemas.opengis.net/wps/1.0.0/wpsAll.xsd");
    exports.exec.setAttribute("version", "1.0.0");
    exports.exec.setAttribute("service", "WPS");
    exports.docu.documentElement.appendChild(exports.exec);
    return exports.docu;
}

exports.add_identifier = function (ident) {
    var ideP = exports.docu.createElementNS("http://www.opengis.net/ows/1.1", "ows:Identifier");
    var tide = exports.docu.createTextNode(ident);
    ideP.appendChild(tide);
    exports.exec.appendChild(ideP);
}

exports.add_inputs = function (inputs_def) {
    var inputs = exports.docu.createElementNS("http://www.opengis.net/wps/1.0.0","wps:DataInputs" ),
        input_def = inputs_def[0], //TODO: make accept multiple inputs
        input = exports.docu.createElementNS("http://www.opengis.net/wps/1.0.0","wps:Input" ),
        identifier = exports.docu.createElementNS("http://www.opengis.net/ows/1.1", "ows:Identifier"),
        tide = exports.docu.createTextNode(input_def.identifier),
        title = exports.docu.createElementNS("http://www.opengis.net/ows/1.1", "ows:Title"),
        title_cont = exports.docu.createTextNode(input_def.identifier),
        data = exports.docu.createElementNS("http://www.opengis.net/wps/1.0.0", "wps:Data"),
        cd = exports.docu.createElementNS("http://www.opengis.net/wps/1.0.0", "wps:ComplexData");
    cd.setAttribute("mimeType", input_def.mimeType);
    if (input_def.mimeType == "application/wkt") {
        var cd_cont = exports.docu.createCDATASection(input_def.data);
    }
    exports.exec.appendChild(inputs);
    identifier.appendChild(tide);
    title.appendChild(title_cont);
    input.appendChild(title);
    input.appendChild(identifier);
    inputs.appendChild(input);
    cd.appendChild(cd_cont);
    data.appendChild(cd);
    input.appendChild(data);
}

exports.add_response_form = function (response_def) {
    var resp = exports.docu.createElementNS("http://www.opengis.net/wps/1.0.0","wps:ResponseForm"),
        rawDataOut = exports.docu.createElementNS("http://www.opengis.net/wps/1.0.0","wps:RawDataOutput");
    rawDataOut.setAttribute("mimeType", response_def.mimeType)
    var ident = exports.docu.createElementNS("http://www.opengis.net/ows/1.1", "ows:Identifier"),
        ident_cont = exports.docu.createTextNode(response_def.identifier);
    ident.appendChild(ident_cont);
    rawDataOut.appendChild(ident);
    resp.appendChild(rawDataOut);
    exports.exec.appendChild(resp);
}

exports.build = function (configuration) {
    // Process
    var docu = exports.make_execute_document(),
        exec = docu.getElementsByTagName("Execute")[0];
    exports.add_identifier(configuration.identifier)
    // Inputs
    exports.add_inputs(configuration.inputs)
    // ResposeForm
    exports.add_response_form(configuration.response)
    return docu
}

exports.serialize = function (xml) {
    s = new XMLSerializer();
    return s.serializeToString(xml)
}
})((typeof(exports) === "undefined") ? this['wps_builder'] = {} : exports)
