(function (exports) {

    exports.makeExecuteDocument = function () {
        var namespaces = "xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' " +
            " xmlns='http://www.opengis.net/wps/1.0.0'  xmlns:wfs='http://www.opengis.net/wfs' " +
            " xmlns:wps='http://www.opengis.net/wps/1.0.0' xmlns:ows='http://www.opengis.net/ows/1.1' " +
            "xmlns:gml='http://www.opengis.net/gml' xmlns:ogc='http://www.opengis.net/ogc' " +
            "xmlns:wcs='http://www.opengis.net/wcs/1.1.1' xmlns:xlink='http://www.w3.org/1999/xlink' " +
            "xsi:schemaLocation='http://www.opengis.net/wps/1.0.0 " +
            "http://schemas.opengis.net/wps/1.0.0/wpsAll.xsd'",
            docu;
        docu = new DOMParser().parseFromString("" +
            "<wps:Execute version='1.0.0' service='WPS' " +
            namespaces + "></wps:Execute>", "application/xml");
        return docu;
    };

    exports.makeExecuteNode = function (docu) {
        var node = docu.createElementNS("http://www.opengis.net/wps/1.0.0", "Execute");
        node.setAttribute("version", "1.0.0");
        node.setAttribute("service", "WPS");
        return node;
    };

    exports.addIdentifier = function (identText, docu, exec) {
        var ident = docu.createElementNS("http://www.opengis.net/ows/1.1", "Identifier");
        var identCont = docu.createTextNode(identText);
        ident.appendChild(identCont);
        exec.appendChild(ident);
    };

    exports.addInputs = function (inputsDef, docu, exec) {
        var inputs = docu.createElementNS("http://www.opengis.net/wps/1.0.0", "DataInputs"),
            input;
        for (var idx = 0; idx < inputsDef.length; idx++) {
            input = exports.addInput(inputsDef[idx], docu, exec);
            inputs.appendChild(input);
        }
        exec.appendChild(inputs);
    };

    exports.addInput = function (inputDef, docu) {
        var input = docu.createElementNS("http://www.opengis.net/wps/1.0.0", "Input"),
            identifier = docu.createElementNS("http://www.opengis.net/ows/1.1", "Identifier"),
            identifierCont = docu.createTextNode(inputDef.identifier),
            data, cd, cdCont, reference, body, getFeature, query,
            wcsIdentifier, wcsIdentifierCont, getCoverage, domainSubset,
            output, litData, litDataCont;
        input.appendChild(identifier);
        if (inputDef.mimeType) {
            data = docu.createElementNS("http://www.opengis.net/wps/1.0.0", "Data");
            cd = docu.createElementNS("http://www.opengis.net/wps/1.0.0", "ComplexData");
            cd.setAttribute("mimeType", inputDef.mimeType);
            cdCont = docu.createCDATASection(inputDef.data);
            cd.appendChild(cdCont);
            data.appendChild(cd);
            input.appendChild(data);
        } else if (inputDef.reference) {
            reference = docu.createElementNS("http://www.opengis.net/wps/1.0.0", "Reference");
            body = docu.createElementNS("http://www.opengis.net/wps/1.0.0", "Body");
            if (inputDef.reference.type === "wfs") {
                reference.setAttribute("mimeType", "text/xml");
                reference.setAttributeNS("http://www.w3.org/1999/xlink", "href", "http://geoserver/wfs");
                reference.setAttribute("method", "POST");
                getFeature = docu.createElementNS("http://www.opengis.net/wfs", "GetFeature");
                //getFeature.setAttributeNS("http://www.w3.org/1999/xhtml", inputDef.typeName.split(":")[0],
                getFeature.setAttribute(inputDef.typeName.split(":")[0],
                                        (inputDef.typeNamespace || "http://www.openplans.org/topp"));
                getFeature.setAttribute("service", "WFS");
                getFeature.setAttribute("version", "1.0.0");
                getFeature.setAttribute("outputFormat", "GML2");
                query = docu.createElementNS("http://www.opengis.net/wfs", "Query");
                query.setAttribute("typeName", inputDef.typeName);
                reference.appendChild(body);
                body.appendChild(getFeature);
                getFeature.appendChild(query);
                input.appendChild(reference);
            } else if (inputDef.reference.type === "wcs") {
                reference.setAttribute("mimeType", "image/tiff");
                reference.setAttributeNS("http://www.w3.org/1999/xlink", "href", "http://geoserver/wcs");
                reference.setAttribute("method", "POST");
                wcsIdentifier = docu.createElementNS("http://www.opengis.net/ows/1.1", "Identifier");
                wcsIdentifierCont = docu.createTextNode(inputDef.reference.identifier);
                wcsIdentifier.appendChild(wcsIdentifierCont);
                getCoverage = docu.createElementNS("http://www.opengis.net/wcs/1.1.1", "GetCoverage");
                getCoverage.setAttribute("service", "WCS");
                getCoverage.setAttribute("version", "1.1.1");
                getCoverage.appendChild(wcsIdentifier);
                domainSubset = docu.createElementNS("http://www.opengis.net/wcs/1.1.1", "DomainSubset");
                output = docu.createElementNS("http://www.opengis.net/wcs/1.1.1", "Output");
                output.setAttribute("format", "image/tiff");
                getCoverage.appendChild(domainSubset);
                getCoverage.appendChild(output);
                body.appendChild(getCoverage);
                reference.appendChild(body);
                input.appendChild(reference);
            }
        } else if (inputDef.subprocess) {
            var proc = inputDef.subprocess,
                subtree = exports.makeExecuteNode(docu);
            body = docu.createElementNS("http://www.opengis.net/wps/1.0.0", "Body");
            reference = docu.createElementNS("http://www.opengis.net/wps/1.0.0", "Reference");
            reference.setAttribute("mimeType", (inputDef.mimeType ? inputDef.mimeType : "text/xml; subtype=gml/3.1.1"));
            reference.setAttributeNS("http://www.w3.org/1999/xlink", "href", "http://geoserver/wps");
            reference.setAttribute("method", "POST");
            reference.appendChild(body);
            body.appendChild(subtree);
            exports.addIdentifier(proc.identifier, docu, subtree);
            // Inputs
            exports.addInputs(proc.inputs, docu, subtree);
            // ResposeForm
            exports.addResponseForm(proc.response, docu, subtree);
            input.appendChild(reference);
        } else { //plain input ad data
            data = docu.createElementNS("http://www.opengis.net/wps/1.0.0", "Data");
            litData = docu.createElementNS("http://www.opengis.net/wps/1.0.0", "LiteralData");
            litDataCont = docu.createTextNode(inputDef.data);
            litData.appendChild(litDataCont);
            data.appendChild(litData);
            input.appendChild(data);
        }
        identifier.appendChild(identifierCont);
        return input;
    };

    exports.addResponseForm = function (responseDef, docu, exec) {
        var resp = docu.createElementNS("http://www.opengis.net/wps/1.0.0", "ResponseForm"),
            rawDataOut = docu.createElementNS("http://www.opengis.net/wps/1.0.0", "RawDataOutput");
        if (responseDef.mimeType) {
            rawDataOut.setAttribute("mimeType", responseDef.mimeType);
        }
        var ident = docu.createElementNS("http://www.opengis.net/ows/1.1", "Identifier"),
            identCont = docu.createTextNode(responseDef.identifier);
        ident.appendChild(identCont);
        rawDataOut.appendChild(ident);
        resp.appendChild(rawDataOut);
        exec.appendChild(resp);
    };

    exports.build = function (configuration) {
        // Process
        exports.docu = exports.makeExecuteDocument();
        exports.exec = exports.docu.firstChild;
            //exec = docu.getElementsByTagName("Execute")[0];
        exports.addIdentifier(configuration.identifier, exports.docu, exports.exec);
        // Inputs
        exports.addInputs(configuration.inputs, exports.docu, exports.exec);
        // ResposeForm
        exports.addResponseForm(configuration.response, exports.docu, exports.exec);
        return exports.docu;
    };

    exports.serialize = function (xml) {
        var s = new XMLSerializer();
        return s.serializeToString(xml);
    };
})((typeof(exports) === "undefined") ? this.wpsBuilder = {} : exports);
