(function (exports) {

exports.Xinit = function () {
    var docu = new DOMParser().parseFromString('<xml></xml>',  "application/xml")
//    var wpsDocType = docu.implementation.createDocumentType ("wps", "SYSTEM", "<!ENTITY tf 'wps'>"),
//       doc = docu.implementation.createDocument("http://ogc.org/wps", "wps", wpsDocType),
        exec = docu.createElementNS("http://www.opengis.net/wps/1.0.0", "wps:Execute");
    exec.setAttributeNS( "http://www.w3.org/2001/XMLSchema-instance", "xsi:schemaLocation","http://www.opengis.net/wps/1.0.0 http://schemas.opengis.net/wps/1.0.0/wpsAll.xsd")
    exec.setAttribute("version", "1.0.0")
    exec.setAttribute("service", "WPS")
    docu.documentElement.appendChild(exec)
    // Process
    var ideP = docu.createElementNS("http://www.opengis.net/ows/1.1", "ows:Identifier")
    var tide = docu.createTextNode("geo:envelope");
    ideP.appendChild(tide)
    exec.appendChild(ideP);
    // Inputs
    var inputs = docu.createElementNS("http://www.opengis.net/wps/1.0.0","wps:DataInputs" )
    exec.appendChild(inputs)
    //Input identifyier
    var input = docu.createElementNS("http://www.opengis.net/wps/1.0.0","wps:Input" )
    var ideG = docu.createElementNS("http://www.opengis.net/ows/1.1", "ows:Identifier")
    var tide = docu.createTextNode("geom");
    ideG.appendChild(tide)
    var titleG = docu.createElementNS("http://www.opengis.net/ows/1.1", "ows:Title")
    var ttitle = docu.createTextNode("geom");
    titleG.appendChild(ttitle)
    input.appendChild(titleG);
    input.appendChild(ideG);
    //ideG.appendChild(input2)
    inputs.appendChild(input)
    var data = docu.createElementNS("http://www.opengis.net/wps/1.0.0","wps:Data");
    var cd = docu.createElementNS("http://www.opengis.net/wps/1.0.0","wps:ComplexData")
    cd.setAttribute("mimeType", "application/wkt")
    var wkt = docu.createCDATASection("POLYGON((110 20,120 20,120 10,110 10,110 20),(112 17,118 18,118 16,112 15,112 17))");
    cd.appendChild(wkt)
    data.appendChild(cd)
    input.appendChild(data)
    //input.innerText = "ert"
    //ideG.appendChild(input);
    var resp = docu.createElementNS("http://www.opengis.net/wps/1.0.0","wps:ResponseForm");
    var rawDataOut = docu.createElementNS("http://www.opengis.net/wps/1.0.0","wps:RawDataOutput");
    rawDataOut.setAttribute("mimeType", "application/wkt")
    var ideOut = docu.createElementNS("http://www.opengis.net/ows/1.1", "ows:Identifier")
    var tideOut = docu.createTextNode("result");
    ideOut.appendChild(tideOut);
    rawDataOut.appendChild(ideOut);
    resp.appendChild(rawDataOut);
    exec.appendChild(resp);
    return exec
}

function serialize(){
    return s.serializeToString(exec)
}
