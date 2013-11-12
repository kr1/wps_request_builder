s = new XMLSerializer();

// example payload
//
//<wps:Execute xmlns:wps="http://www.opengis.net/wps/1.0.0" version="1.0.0" service="WPS" xsi:schemaLocation="http://www.opengis.net/wps/1.0.0 http://schemas.opengis.net/wps/1.0.0/wpsAll.xsd" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
//   <ows:Identifier xmlns:ows="http://www.opengis.net/ows/1.1">
//     geo:envelope
//   </ows:Identifier>
//   <wps:DataInputs>
//     <wps:Input>
//       <ows:Identifier xmlns:ows="http://www.opengis.net/ows/1.1">geom
//       </ows:Identifier>
//       <ows:Title xmlns:ows="http://www.opengis.net/ows/1.1">
//         geom
//       </ows:Title>
//       <wps:Data>
//         <wps:ComplexData mimeType="application/wkt">
//           <![CDATA[POLYGON((110 20,120 20,120 10,110 10,110 20),(112 17,118 18,118 16,112 15,112 17))]]>
//         </wps:ComplexData>
//       </wps:Data>
//     </wps:Input>
//   </wps:DataInputs>
//   <wps:ResponseForm>
//     <wps:RawDataOutput mimeType="application/wkt">
//       <ows:Identifier xmlns:ows="http://www.opengis.net/ows/1.1">
//         result
//       </ows:Identifier>
//     </wps:RawDataOutput>
//   </wps:ResponseForm>
//   </wps:Execute>
function Xinit(){
    var wpsDocType = document.implementation.createDocumentType ("wps", "SYSTEM", "<!ENTITY tf 'wps'>"),
        doc = document.implementation.createDocument("http://ogc.org/wps", "wps", wpsDocType),
        exec = document.createElementNS("http://www.opengis.net/wps/1.0.0", "wps:Execute");
    exec.setAttributeNS( "http://www.w3.org/2001/XMLSchema-instance", "xsi:schemaLocation","http://www.opengis.net/wps/1.0.0 http://schemas.opengis.net/wps/1.0.0/wpsAll.xsd")
    exec.setAttribute("version", "1.0.0")
    exec.setAttribute("service", "WPS")
    doc.documentElement.appendChild(exec)
    // Process
    var ideP = document.createElementNS("http://www.opengis.net/ows/1.1", "ows:Identifier")
    var tide = document.createTextNode("geo:envelope");
    ideP.appendChild(tide)
    exec.appendChild(ideP);
    // Inputs
    var inputs = document.createElementNS("http://www.opengis.net/wps/1.0.0","wps:DataInputs" )
    exec.appendChild(inputs)
    //Input identifyier
    var input = document.createElementNS("http://www.opengis.net/wps/1.0.0","wps:Input" )
    var ideG = document.createElementNS("http://www.opengis.net/ows/1.1", "ows:Identifier")
    var tide = document.createTextNode("geom");
    ideG.appendChild(tide)
    var titleG = document.createElementNS("http://www.opengis.net/ows/1.1", "ows:Title")
    var ttitle = document.createTextNode("geom");
    titleG.appendChild(ttitle)
    input.appendChild(titleG);
    input.appendChild(ideG);
    //ideG.appendChild(input2)
    inputs.appendChild(input)
    var data = document.createElementNS("http://www.opengis.net/wps/1.0.0","wps:Data");
    var cd = document.createElementNS("http://www.opengis.net/wps/1.0.0","wps:ComplexData")
    cd.setAttribute("mimeType", "application/wkt")
    var wkt = document.createTextNode("POLYGON((110 20,120 20,120 10,110 10,110 20),(112 17,118 18,118 16,112 15,112 17))")
    cd.appendChild(wkt)
    data.appendChild(cd)
    input.appendChild(data)
    //input.innerText = "ert"
    //ideG.appendChild(input);
    var resp = document.createElementNS("http://www.opengis.net/wps/1.0.0","wps:ResponseForm");
    var rawDataOut = document.createElementNS("http://www.opengis.net/wps/1.0.0","wps:RawDataOutput");
    rawDataOut.setAttribute("mimeType", "application/wkt")
    var ideOut = document.createElementNS("http://www.opengis.net/ows/1.1", "ows:Identifier")
    var tideOut = document.createTextNode("result");
    ideOut.appendChild(tideOut);
    rawDataOut.appendChild(ideOut);
    resp.appendChild(rawDataOut);
    exec.appendChild(resp);
    return exec
}

function serialize(){
    return s.serializeToString(exec)
}
