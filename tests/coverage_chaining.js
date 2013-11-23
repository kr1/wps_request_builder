/* global vkbeautify, wpsBuilder*/

(function (exports) {
    exports.coverageChainingExample = "" +
        "<?xml version='1.0' encoding='UTF-8'?><wps:Execute version='1.0.0' service='WPS' " +
        "xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xmlns='http://www.opengis.net/wps/1.0.0' " +
        "xmlns:wfs='http://www.opengis.net/wfs' xmlns:wps='http://www.opengis.net/wps/1.0.0' " +
        "xmlns:ows='http://www.opengis.net/ows/1.1' xmlns:gml='http://www.opengis.net/gml' " +
        "xmlns:ogc='http://www.opengis.net/ogc' " +
        "xmlns:wcs='http://www.opengis.net/wcs/1.1.1' xmlns:xlink='http://www.w3.org/1999/xlink' " +
        "xsi:schemaLocation='http://www.opengis.net/wps/1.0.0 http://schemas.opengis.net/wps/1.0.0/wpsAll.xsd'>" +
        "  <ows:Identifier>gs:Import</ows:Identifier>" +
        "  <wps:DataInputs>" +
        "    <wps:Input>" +
        "      <ows:Identifier>coverage</ows:Identifier>" +
        "      <wps:Reference mimeType='image/tiff' xlink:href='http://geoserver/wps' method='POST'>" +
        "        <wps:Body>" +
        "          <wps:Execute version='1.0.0' service='WPS'>" +
        "            <ows:Identifier>ras:CropCoverage</ows:Identifier>" +
        "            <wps:DataInputs>" +
        "              <wps:Input>" +
        "                <ows:Identifier>coverage</ows:Identifier>" +
        "                <wps:Reference mimeType='image/tiff' xlink:href='http://geoserver/wcs' method='POST'>" +
        "                  <wps:Body>" +
        "                    <wcs:GetCoverage service='WCS' version='1.1.1'>" +
        "                      <ows:Identifier>nurc:Arc_Sample</ows:Identifier>" +
        "                      <wcs:DomainSubset>" +
        "                      </wcs:DomainSubset>" +
        "                      <wcs:Output format='image/tiff'/>" +
        "                    </wcs:GetCoverage>" +
        "                  </wps:Body>" +
        "                </wps:Reference>" +
        "              </wps:Input>" +
        "              <wps:Input>" +
        "                <ows:Identifier>cropShape</ows:Identifier>" +
        "                <wps:Data>" +
        "                  <wps:ComplexData mimeType='application/wkt'><![CDATA[POLYGON(" +
        "                              (110 20,120 20,120 10,110 10,110 20), " +
        "                              (112 17,118 18,118 16,112 15,112 17))]]></wps:ComplexData>" +
        "                </wps:Data>" +
        "              </wps:Input>" +
        "            </wps:DataInputs>" +
        "            <wps:ResponseForm>" +
        "              <wps:RawDataOutput mimeType='image/tiff'>" +
        "                <ows:Identifier>result</ows:Identifier>" +
        "              </wps:RawDataOutput>" +
        "            </wps:ResponseForm>" +
        "          </wps:Execute>" +
        "        </wps:Body>" +
        "      </wps:Reference>" +
        "    </wps:Input>" +
        "  </wps:DataInputs>" +
        "  <wps:ResponseForm>" +
        "    <wps:RawDataOutput>" +
        "      <ows:Identifier>layerName</ows:Identifier>" +
        "    </wps:RawDataOutput>" +
        "  </wps:ResponseForm>" +
        "</wps:Execute>";

    exports.displayCoverageChaining = function () {
        var innerProcessClip = {
                identifier: "ras:CropCoverage",
                inputs: [{
                    identifier: "coverage",
                    reference: {type: "wcs"},
                    typeName: "nurc:Arc_Sample"
                }, {
                    identifier: "cropShape",
                    mimeType: "application/wkt",
                    data: "POLYGON((146 -41,146 -43,147 -43,147 -41,146 -41))"
                }],
                response: {
                    identifier: "result",
                    mimeType: "image/tiff"
                }
            },
            text = wpsBuilder.build({
                identifier: "gs:Import",
                inputs: [{
                    identifier: "coverage",
                    subprocess: innerProcessClip
                }],
                response: {
                    identifier: "result",
                    data: "layerName",
                }
            }),
            ser = wpsBuilder.serialize(text);
        document.getElementById("left_code").innerText = vkbeautify.xml(ser);
        document.getElementById("right_code").innerText = vkbeautify.xml(exports.coverageChainingExample);
        return true;
    };
})((typeof(exports) === "undefined") ? this.wpsBuilder.tests.coverageChaining = {} : exports);
