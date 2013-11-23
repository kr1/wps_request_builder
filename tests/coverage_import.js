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
          "<ows:Identifier>gs:Import</ows:Identifier>" +
          "<wps:DataInputs>" +
            "<wps:Input>" +
              "<ows:Identifier>coverage</ows:Identifier>" +
              "<wps:Reference mimeType='image/tiff' xlink:href='http://geoserver/wcs' method='POST'>" +
                "<wps:Body>" +
                  "<wcs:GetCoverage service='WCS' version='1.1.1'>" +
                    "<ows:Identifier>sf:sfdem</ows:Identifier>" +
                    "<wcs:DomainSubset>" +
                    "</wcs:DomainSubset>" +
                    "<wcs:Output format='image/tiff'/>" +
                  "</wcs:GetCoverage>" +
                "</wps:Body>" +
              "</wps:Reference>" +
            "</wps:Input>" +
            "<wps:Input>" +
              "<ows:Identifier>workspace</ows:Identifier>" +
              "<wps:Data>" +
                "<wps:LiteralData>testWorkspace</wps:LiteralData>" +
              "</wps:Data>" +
            "</wps:Input>" +
        /*"    <wps:Input>" +
              "<ows:Identifier>store</ows:Identifier>" +
              "<wps:Data>" +
                "<wps:LiteralData>Store</wps:LiteralData>" +
              "</wps:Data>" +
            "</wps:Input>" +
        */
            "<wps:Input>" +
              "<ows:Identifier>name</ows:Identifier>" +
              "<wps:Data>" +
                "<wps:LiteralData>Nöm</wps:LiteralData>" +
              "</wps:Data>" +
            "</wps:Input>" +
            "<wps:Input>" +
              "<ows:Identifier>srs</ows:Identifier>" +
              "<wps:Data>" +
                "<wps:LiteralData>EPSG:26713</wps:LiteralData>" +
              "</wps:Data>" +
            "</wps:Input>" +
            "<wps:Input>" +
              "<ows:Identifier>styleName</ows:Identifier>" +
              "<wps:Data>" +
                "<wps:LiteralData>dem</wps:LiteralData>" +
              "</wps:Data>" +
            "</wps:Input>" +
          "</wps:DataInputs>" +
          "<wps:ResponseForm>" +
            "<wps:RawDataOutput>" +
              "<ows:Identifier>layerName</ows:Identifier>" +
            "</wps:RawDataOutput>" +
          "</wps:ResponseForm>" +
        "</wps:Execute>";

    exports.buildExample = function () {
        var text = wpsBuilder.build({
                identifier: "gs:Import",
                inputs: [{
                    identifier: "coverage",
                    reference: {
                        type: "wcs",
                        identifier: "sf:sfdem"
                    }
                }, {
                    identifier: "workspace",
                    data: "testWorkspace"
                },/* will create a new store if omitted
                    , {
                    identifier: "store",
                    data: "Sto",
                }*/ {
                    identifier: "name",
                    data: "Nöm"
                }, {
                    identifier: "srs",
                    data: "EPSG:26713"
                }, {
                    identifier: "styleName",
                    data: "dem"
                }],
                response: {
                    identifier: "layerName",
                }
            });
        return text;
    };
    exports.displayCoverageImport = function () {
        var ser = wpsBuilder.serialize(exports.buildExample());
        document.getElementById("left_code").innerText = vkbeautify.xml(ser);
        document.getElementById("right_code").innerText = vkbeautify.xml(exports.coverageImportExample);
        return true;
    };
})((typeof(exports) === "undefined") ? this.wpsBuilder.tests.coverageImport = {} : exports);
