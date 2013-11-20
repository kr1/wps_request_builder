(function (exports) {

    exports.makeExecuteDocument = function (options) {
        var namespaces = "xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' " +
            " xmlns='http://www.opengis.net/wps/1.0.0'  xmlns:wfs='http://www.opengis.net/wfs' " +
            "xmlns:ows='http://www.opengis.net/ows/1.1' " +
            "xmlns:gml='http://www.opengis.net/gml' xmlns:ogc='http://www.opengis.net/ogc' " +
            "xmlns:wcs='http://www.opengis.net/wcs/1.1.1' xmlns:xlink='http://www.w3.org/1999/xlink' " +
            "xsi:schemaLocation='http://www.opengis.net/wps/1.0.0 " +
            "http://schemas.opengis.net/wps/1.0.0/wpsAll.xsd'",
            docu;
        if (options && options.withoutNamespaces) {
            namespaces = "";
        }
        docu = new DOMParser().parseFromString("" +
            "<wps:Execute version='1.0.0' service='WPS' xmlns:wps='http://www.opengis.net/wps/1.0.0'" +
            namespaces + "></wps:Execute>", "application/xml");
        return docu;
    };

    exports.addIdentifier = function (ident, docu, exec) {
        var ideP = docu.createElementNS("http://www.opengis.net/ows/1.1", "ows:Identifier");
        var tide = docu.createTextNode(ident);
        ideP.appendChild(tide);
        exec.appendChild(ideP);
    };

    exports.addInputs = function (inputsDef, docu, exec) {
        var inputs = docu.createElementNS("http://www.opengis.net/wps/1.0.0", "wps:DataInputs"),
            input;
        for (var idx = 0; idx < inputsDef.length; idx++) {
            input = exports.addInput(inputsDef[idx], docu, exec);
            inputs.appendChild(input);
        }
        exec.appendChild(inputs);
    };

    exports.addInput = function (inputDef, docu) {
        var input = docu.createElementNS("http://www.opengis.net/wps/1.0.0", "wps:Input"),
            identifier = docu.createElementNS("http://www.opengis.net/ows/1.1", "ows:Identifier"),
            identifierCont = docu.createTextNode(inputDef.identifier),
            //title = docu.createElementNS("http://www.opengis.net/ows/1.1", "ows:Title"),
            //titleCont = docu.createTextNode(inputDef.identifier),
            data, litData, cd, cdCont, reference, body, getFeature, query,
            wcsIdentifier, wcsIdentifierCont, getCoverage, domainSubset,
            output, litData, litDataCont;
        if (inputDef.mimeType && inputDef.mimeType === "application/wkt") {
            data = docu.createElementNS("http://www.opengis.net/wps/1.0.0", "wps:Data");
            cd = docu.createElement("wps:ComplexData");
            cd.setAttribute("mimeType", inputDef.mimeType);
            cdCont = docu.createCDATASection(inputDef.data);
            cd.appendChild(cdCont);
            data.appendChild(cd);
            input.appendChild(data);
        } else if (inputDef.reference) {
            reference = docu.createElement("wps:Reference");
            body = docu.createElement("wps:Body");
            if (inputDef.reference.type === "wfs") {
                reference.setAttribute("mimeType", "text/xml");
                reference.setAttribute("xlink:href", "http://geoserver/wfs");
                reference.setAttribute("method", "POST");
                getFeature = docu.createElement("wfs:GetFeature");
                getFeature.setAttribute("service", "WFS");
                getFeature.setAttribute("version", "1.0.0");
                getFeature.setAttribute("outputFormat", "GML2");
                getFeature.setAttribute("xmlns:" + inputDef.typeName.split(":")[0],
                                        (inputDef.typeNamespace || "http://www.openplans.org/topp"));
                query = docu.createElement("wfs:Query");
                query.setAttribute("typeName", inputDef.typeName);
                reference.appendChild(body);
                body.appendChild(getFeature);
                getFeature.appendChild(query);
                input.appendChild(reference);
            } else if (inputDef.reference.type === "wcs") {
                reference.setAttribute("mimeType", "image/tiff");
                reference.setAttribute("xlink:href", "http://geoserver/wcs");
                reference.setAttribute("method", "POST");
                wcsIdentifier = docu.createElementNS("http://www.opengis.net/ows/1.1", "ows:Identifier");
                wcsIdentifierCont = docu.createTextNode(inputDef.reference.identifier);
                wcsIdentifier.appendChild(wcsIdentifierCont);
                getCoverage = docu.createElement("wfs:GetCoverage");
                getCoverage.setAttribute("service", "WCS");
                getCoverage.setAttribute("version", "1.1.1");
                domainSubset = docu.createElement("wcs:DomainSubset");
                output = docu.createElement("wcs:Output");
                output.setAttribute("format", "image/tiff");
                getCoverage.appendChild(domainSubset);
                getCoverage.appendChild(output);
                getCoverage.appendChild(wcsIdentifier);
                body.appendChild(getCoverage);
                reference.appendChild(body);
                // TODO: check the folloeing idetifier, necessary?
                //reference.appendChild(identifier);
                input.appendChild(reference);
            }
        } else if (inputDef.subprocess) {
            var proc = inputDef.subprocess,
                subtreeDoc = exports.makeExecuteDocument({withoutNamespaces: true}),
                subtree = subtreeDoc.firstChild;
            body = subtreeDoc.createElementNS("http://www.opengis.net/wps/1.0.0", "wps:Body");
            reference = subtreeDoc.createElementNS("http://www.opengis.net/wps/1.0.0", "wps:Reference");
            reference.setAttribute("mimeType", "text/xml; subtype=gml/3.1.1");
            reference.setAttribute("xlink:href", "http://geoserver/wps");
            reference.setAttribute("method", "POST");
            reference.appendChild(body);
            body.appendChild(subtree);
            exports.addIdentifier(proc.identifier, subtreeDoc, body);
            // Inputs
            exports.addInputs(proc.inputs, subtreeDoc, body);
            // ResposeForm
            exports.addResponseForm(proc.response, subtreeDoc, body);
            input.appendChild(reference);
        } else { //plain input ad data
            data = docu.createElementNS("http://www.opengis.net/wps/1.0.0", "wps:Data");
            litData = docu.createElementNS("http://www.opengis.net/wps/1.0.0", "wps:LiteralData");
            litDataCont = docu.createTextNode(inputDef.data);
            litData.appendChild(litDataCont);
            data.appendChild(litData);
            input.appendChild(data);
        }
        identifier.appendChild(identifierCont);
        // TODO: check: is title necessary?
        //title.appendChild(titleCont);
        //input.appendChild(title);
        input.appendChild(identifier);
        return input;
    };

    exports.addResponseForm = function (responseDef, docu, exec) {
        var resp = docu.createElementNS("http://www.opengis.net/wps/1.0.0", "wps:ResponseForm"),
            rawDataOut = docu.createElementNS("http://www.opengis.net/wps/1.0.0", "wps:RawDataOutput");
        rawDataOut.setAttribute("mimeType", responseDef.mimeType);
        var ident = docu.createElementNS("http://www.opengis.net/ows/1.1", "ows:Identifier"),
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
