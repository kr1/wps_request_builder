if (typeof(this.wps_builder.tests) === 'undefined') {
    this.wps_builder.tests = {};
}

(function (exports) {
    exports.geom_and_layer_example = '' +
    '<?xml version="1.0" encoding="UTF-8"?><wps:Execute version="1.0.0" service="WPS" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://www.opengis.net/wps/1.0.0" xmlns:wfs="http://www.opengis.net/wfs" xmlns:wps="http://www.opengis.net/wps/1.0.0" xmlns:ows="http://www.opengis.net/ows/1.1" xmlns:gml="http://www.opengis.net/gml" xmlns:ogc="http://www.opengis.net/ogc" xmlns:wcs="http://www.opengis.net/wcs/1.1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xsi:schemaLocation="http://www.opengis.net/wps/1.0.0 http://schemas.opengis.net/wps/1.0.0/wpsAll.xsd">' +
    '  <ows:Identifier>gs:Clip</ows:Identifier>' +
    '  <wps:DataInputs>' +
    '    <wps:Input>' +
    '      <ows:Identifier>features</ows:Identifier>' +
    '      <wps:Reference mimeType="text/xml" xlink:href="http://geoserver/wfs" method="POST">' +
    '        <wps:Body>' +
    '          <wfs:GetFeature service="WFS" version="1.0.0" outputFormat="GML2" xmlns:topp="http://www.openplans.org/topp">' +
    '            <wfs:Query typeName="topp:tasmania_roads"/>' +
    '          </wfs:GetFeature>' +
    '        </wps:Body>' +
    '      </wps:Reference>' +
    '    </wps:Input>' +
    '    <wps:Input>' +
    '      <ows:Identifier>clip</ows:Identifier>' +
    '      <wps:Data>' +
    '        <wps:ComplexData mimeType="text/xml; subtype=gml/3.1.1"><![CDATA[POLYGON((110 20,120 20,120 10,110 10,110 20),(112 17,118 18,118 16,112 15,112 17))]]></wps:ComplexData>' +
    '      </wps:Data>' +
    '    </wps:Input>' +
    '  </wps:DataInputs>' +
    '  <wps:ResponseForm>' +
    '    <wps:RawDataOutput mimeType="text/xml; subtype=wfs-collection/1.0">' +
    '      <ows:Identifier>result</ows:Identifier>' +
    '    </wps:RawDataOutput>' +
    '  </wps:ResponseForm>' +
    '</wps:Execute>' +

exports.display_geom_and_layer = function () {
    document.getElementById("left_code").innerText = vkbeautify.xml(
        wps_builder.serialize(
            wps_builder.build({
              identifier: "gs:Clip",
              inputs: [{
                      identifier: 'features',
                      reference: {type: 'wfs'},
                      typeName: "topp:tasmania_roads"
                  }, {
                      identifier: "clip",
                      mimeType: "application/wkt",
                      data: "POLYGON((110 20,120 20,120 10,110 10,110 20),(112 17,118 18,118 16,112 15,112 17))"
              }],
              response: {
                  identifier: "result",
                  mimeType: "text/xml; subtype=wfs-collection/1.0"
              }
            }
    )));
    document.getElementById("right_code").innerText = vkbeautify.xml(exports.simple_geom_example)
}
})((typeof(exports) === "undefined") ? this.wps_builder['tests']['geom_and_layer'] = {} : exports)
