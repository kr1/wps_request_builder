(function (exports) {

    exports.makeExecuteDocument = function () {
        exports.docu = new DOMParser().parseFromString("" +
                  "<wps:Execute version='1.0.0' service='WPS' xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' " +
                  "xmlns='http://www.opengis.net/wps/1.0.0' xmlns:wfs='http://www.opengis.net/wfs' " +
                  "xmlns:wps='http://www.opengis.net/wps/1.0.0' xmlns:ows='http://www.opengis.net/ows/1.1' " +
                  "xmlns:gml='http://www.opengis.net/gml' xmlns:ogc='http://www.opengis.net/ogc' " +
                  "xmlns:wcs='http://www.opengis.net/wcs/1.1.1' xmlns:xlink='http://www.w3.org/1999/xlink' " +
                  "xsi:schemaLocation='http://www.opengis.net/wps/1.0.0 " +
                  "http://schemas.opengis.net/wps/1.0.0/wpsAll.xsd'></wps:Execute>",
                  "application/xml");
        exports.exec = exports.docu.firstChild;
        return exports.docu;
    };

    exports.addIdentifier = function (ident) {
        var ideP = exports.docu.createElementNS("http://www.opengis.net/ows/1.1", "ows:Identifier");
        var tide = exports.docu.createTextNode(ident);
        ideP.appendChild(tide);
        exports.exec.appendChild(ideP);
    };

    exports.addInputs = function (inputsDef) {
        var inputs = exports.docu.createElementNS("http://www.opengis.net/wps/1.0.0", "wps:DataInputs"),
            input;
        for (var idx = 0; idx < inputsDef.length; idx++) {
            input = exports.addInput(inputsDef[idx]);
            inputs.appendChild(input);
        }
        exports.exec.appendChild(inputs);
    };

    exports.addInput = function (inputDef) {
        var input = exports.docu.createElementNS("http://www.opengis.net/wps/1.0.0", "wps:Input"),
            identifier = exports.docu.createElement("ows:Identifier"),
            identifierCont = exports.docu.createTextNode(inputDef.identifier),
            title = exports.docu.createElementNS("http://www.opengis.net/ows/1.1", "ows:Title"),
            titleCont = exports.docu.createTextNode(inputDef.identifier),
            data, cd, cdCont, reference, body, getFeature, query;
        if (inputDef.mimeType && inputDef.mimeType === "application/wkt") {
            data = exports.docu.createElementNS("http://www.opengis.net/wps/1.0.0", "wps:Data");
            cd = exports.docu.createElement("wps:ComplexData");
            cd.setAttribute("mimeType", inputDef.mimeType);
            cdCont = exports.docu.createCDATASection(inputDef.data);
            cd.appendChild(cdCont);
            data.appendChild(cd);
            input.appendChild(data);
        } else if (inputDef.reference) {
            if (inputDef.reference.type === "wfs") {
                reference = exports.docu.createElement("wps:Reference");
                reference.setAttribute("mimeType", "text/xml");
                reference.setAttribute("xlink:href", "http://geoserver/wfs");
                reference.setAttribute("method", "POST");
                body = exports.docu.createElement("wps:Body");
                getFeature = exports.docu.createElement("wfs:GetFeature");
                getFeature.setAttribute("service", "WFS");
                getFeature.setAttribute("version", "1.0.0");
                getFeature.setAttribute("outputFormat", "GML2");
                getFeature.setAttribute("xmlns:" + inputDef.typeName.split(":")[0],
                                        (inputDef.typeNamespace || "http://www.openplans.org/topp"));
                query = exports.docu.createElement("wfs:Query");
                query.setAttribute("typeName", inputDef.typeName);
                reference.appendChild(body);
                body.appendChild(getFeature);
                getFeature.appendChild(query);
                input.appendChild(reference);
            }
        }
        identifier.appendChild(identifierCont);
        title.appendChild(titleCont);
        input.appendChild(title);
        input.appendChild(identifier);
        return input;
    };

    exports.addResponseForm = function (responseDef) {
        var resp = exports.docu.createElementNS("http://www.opengis.net/wps/1.0.0", "wps:ResponseForm"),
            rawDataOut = exports.docu.createElementNS("http://www.opengis.net/wps/1.0.0", "wps:RawDataOutput");
        rawDataOut.setAttribute("mimeType", responseDef.mimeType);
        var ident = exports.docu.createElementNS("http://www.opengis.net/ows/1.1", "ows:Identifier"),
            identCont = exports.docu.createTextNode(responseDef.identifier);
        ident.appendChild(identCont);
        rawDataOut.appendChild(ident);
        resp.appendChild(rawDataOut);
        exports.exec.appendChild(resp);
    };

    exports.build = function (configuration) {
        // Process
        var docu = exports.makeExecuteDocument();
            //exec = docu.getElementsByTagName("Execute")[0];
        exports.addIdentifier(configuration.identifier);
        // Inputs
        exports.addInputs(configuration.inputs);
        // ResposeForm
        exports.addResponseForm(configuration.response);
        return docu;
    };

    exports.serialize = function (xml) {
        var s = new XMLSerializer();
        return s.serializeToString(xml);
    };
})((typeof(exports) === "undefined") ? this.wpsBuilder = {} : exports);
