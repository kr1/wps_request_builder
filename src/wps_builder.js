(function (exports) {

exports.make_execute_document = function() {
    exports.docu = new DOMParser().parseFromString(''+
              '<wps:Execute version="1.0.0" service="WPS" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://www.opengis.net/wps/1.0.0" xmlns:wfs="http://www.opengis.net/wfs" xmlns:wps="http://www.opengis.net/wps/1.0.0" xmlns:ows="http://www.opengis.net/ows/1.1" xmlns:gml="http://www.opengis.net/gml" xmlns:ogc="http://www.opengis.net/ogc" xmlns:wcs="http://www.opengis.net/wcs/1.1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xsi:schemaLocation="http://www.opengis.net/wps/1.0.0 http://schemas.opengis.net/wps/1.0.0/wpsAll.xsd">',  "application/xml"),
    exports.exec = exports.docu.firstChild;
    return exports.docu;
}

exports.add_identifier = function (ident) {
    var ideP = exports.docu.createElementNS("http://www.opengis.net/ows/1.1", "ows:Identifier");
    var tide = exports.docu.createTextNode(ident);
    ideP.appendChild(tide);
    exports.exec.appendChild(ideP);
}

exports.add_inputs = function (inputs_def) {
    var inputs = exports.docu.createElementNS("http://www.opengis.net/wps/1.0.0","wps:DataInputs"),
        input;
    for (var idx=0; idx < inputs_def.length; idx++) {
        input = exports.add_input(inputs_def[idx]);
        inputs.appendChild(input);
    }
    exports.exec.appendChild(inputs);
}
exports.add_input = function (input_def) {
    var input = exports.docu.createElementNS("http://www.opengis.net/wps/1.0.0","wps:Input" ),
        identifier = exports.docu.createElement("ows:Identifier"),
        identifier_cont = exports.docu.createTextNode(input_def.identifier),
        title = exports.docu.createElementNS("http://www.opengis.net/ows/1.1", "ows:Title"),
        title_cont = exports.docu.createTextNode(input_def.identifier),
        data, cd, cd_cont, reference, body, get_feature, query;
    if (input_def.mimeType && input_def.mimeType == "application/wkt") {
        data = exports.docu.createElementNS("http://www.opengis.net/wps/1.0.0", "wps:Data");
        cd = exports.docu.createElement("wps:ComplexData");
        cd.setAttribute("mimeType", input_def.mimeType);
        cd_cont = exports.docu.createCDATASection(input_def.data);
        cd.appendChild(cd_cont);
        data.appendChild(cd);
        input.appendChild(data);
    } else if (input_def.reference) {
        if (input_def.reference.type == 'wfs') {
            reference = exports.docu.createElement("wps:Reference");
            reference.setAttribute('mimeType', 'text/xml');
            reference.setAttribute('xlink:href', 'http://geoserver/wfs');
            reference.setAttribute('method', 'POST');
            body = exports.docu.createElement("wps:Body");
            get_feature = exports.docu.createElement("wfs:GetFeature");
            get_feature.setAttribute('service', 'WFS');
            get_feature.setAttribute('version', '1.0.0'); 
            get_feature.setAttribute('outputFormat', 'GML2');
            get_feature.setAttribute('xmlns:' + input_def.typeName.split(':')[0], input_def.typeNamespace || 'http://www.openplans.org/topp');
            query = exports.docu.createElement('wfs:Query');
            query.setAttribute('typeName', input_def.typeName)
            reference.appendChild(body);
            body.appendChild(get_feature);
            get_feature.appendChild(query)
            input.appendChild(reference);
        }
    }
    identifier.appendChild(identifier_cont);
    title.appendChild(title_cont);
    input.appendChild(title);
    input.appendChild(identifier);
    return input;
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
