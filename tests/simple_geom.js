if (typeof(this.wps_builder.tests) === 'undefined') {
    this.wps_builder.tests = {};
}

(function (exports) {

// example payload
    exports.simple_geom_example = '<wps:Execute xmlns:wps="http://www.opengis.net/wps/1.0.0" version="1.0.0" service="WPS" xsi:schemaLocation="http://www.opengis.net/wps/1.0.0 http://schemas.opengis.net/wps/1.0.0/wpsAll.xsd" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
    '   <ows:Identifier xmlns:ows="http://www.opengis.net/ows/1.1">' +
    '     geo:envelope' +
    '   </ows:Identifier>' +
    '   <wps:DataInputs>' +
    '     <wps:Input>' +
    '       <ows:Identifier xmlns:ows="http://www.opengis.net/ows/1.1">geom' +
    '       </ows:Identifier>' +
    '       <ows:Title xmlns:ows="http://www.opengis.net/ows/1.1">' +
    '         geom' +
    '       </ows:Title>' +
    '       <wps:Data>' +
    '         <wps:ComplexData mimeType="application/wkt">' +
    '           <![CDATA[POLYGON((110 20,120 20,120 10,110 10,110 20),(112 17,118 18,118 16,112 15,112 17))]]>' +
    '         </wps:ComplexData>' +
    '       </wps:Data>' +
    '     </wps:Input>' +
    '   </wps:DataInputs>' +
    '   <wps:ResponseForm>' +
    '     <wps:RawDataOutput mimeType="application/wkt">' +
    '       <ows:Identifier xmlns:ows="http://www.opengis.net/ows/1.1">' +
    '         result' +
    '       </ows:Identifier>' +
    '     </wps:RawDataOutput>' +
    '   </wps:ResponseForm>' +
    '   </wps:Execute>';


exports.display_simple_geom = function () {
    document.getElementById("left_code").innerText = vkbeautify.xml(
        wps_builder.serialize(
            wps_builder.build({
              identifier: "geo:envelope",
              inputs: [{
                  identifier: "geom",
                  mimeType: "application/wkt",
                  data: "POLYGON((110 20,120 20,120 10,110 10,110 20),(112 17,118 18,118 16,112 15,112 17))"
              }],
              response: {
                  identifier: "result",
                  mimeType: "application/wkt",
              }
            }
    )));
    document.getElementById("right_code").innerText = vkbeautify.xml(exports.simple_geom_example)
}
})((typeof(exports) === "undefined") ? this.wps_builder['tests']['simple_geom'] = {} : exports)
