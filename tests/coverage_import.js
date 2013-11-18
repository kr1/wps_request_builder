/* global vkbeautify, wpsBuilder*/

(function (exports) {
    exports.coverageImportExample = "" +
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
        "      <wps:Reference mimeType='image/tiff' xlink:href='http://geoserver/wcs' method='POST'>" +
        "        <wps:Body>" +
        "          <wcs:GetCoverage service='WCS' version='1.1.1'>" +
        "            <ows:Identifier>nurc:Img_Sample</ows:Identifier>" +
        "            <wcs:DomainSubset>" +
        "            </wcs:DomainSubset>" +
        "            <wcs:Output format='image/tiff'/>" +
        "          </wcs:GetCoverage>" +
        "        </wps:Body>" +
        "      </wps:Reference>" +
        "    </wps:Input>" +
        "    <wps:Input>" +
        "      <ows:Identifier>workspace</ows:Identifier>" +
        "      <wps:Data>" +
        "        <wps:LiteralData>workSpace</wps:LiteralData>" +
        "      </wps:Data>" +
        "    </wps:Input>" +
        "    <wps:Input>" +
        "      <ows:Identifier>store</ows:Identifier>" +
        "      <wps:Data>" +
        "        <wps:LiteralData>Store</wps:LiteralData>" +
        "      </wps:Data>" +
        "    </wps:Input>" +
        "    <wps:Input>" +
        "      <ows:Identifier>name</ows:Identifier>" +
        "      <wps:Data>" +
        "        <wps:LiteralData>name</wps:LiteralData>" +
        "      </wps:Data>" +
        "    </wps:Input>" +
        "    <wps:Input>" +
        "      <ows:Identifier>srs</ows:Identifier>" +
        "      <wps:Data>" +
        "        <wps:LiteralData>EPSG:32632</wps:LiteralData>" +
        "      </wps:Data>" +
        "    </wps:Input>" +
        "  </wps:DataInputs>" +
        "  <wps:ResponseForm>" +
        "    <wps:RawDataOutput>" +
        "      <ows:Identifier>layerName</ows:Identifier>" +
        "    </wps:RawDataOutput>" +
        "  </wps:ResponseForm>" +
        "</wps:Execute>";

    exports.displayCoverageImport = function () {
            text = wpsBuilder.build({
                identifier: "gs:Import",
                inputs: [{
                        identifier: "coverage",
                        reference: {
                            type: "wcs",
                            identifier: "nurc:Img_Sample"
                        }
                    }, {
                        identifier: "workspace",
                        data: "workS"
                    }, {
                        identifier: "store",
                        data: "Sto",
                    }, {
                        identifier: "name",
                        data: "Nöm"
                    }, {
                        identifier: "srs",
                        data: "EPSG:32632"
                    }
                ],
                response: {
                    identifier: "layerName",
                }
            }),
            ser = wpsBuilder.serialize(text);
        document.getElementById("left_code").innerText = vkbeautify.xml(ser);
        document.getElementById("right_code").innerText = vkbeautify.xml(exports.coverageChainingExample);
        return true;
    };
})((typeof(exports) === "undefined") ? this.wpsBuilder.tests.coverageImport = {} : exports);
