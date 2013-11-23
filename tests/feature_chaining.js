/* global vkbeautify, wpsBuilder*/

(function (exports) {
    exports.featureChainingExample = "" +
    "<?xml version='1.0' encoding='UTF-8'?>" +
    "<wps:Execute version='1.0.0' service='WPS' " +
    "xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xmlns='http://www.opengis.net/wps/1.0.0' " +
    "xmlns:wfs='http://www.opengis.net/wfs' xmlns:wps='http://www.opengis.net/wps/1.0.0' " +
    "xmlns:ows='http://www.opengis.net/ows/1.1' xmlns:gml='http://www.opengis.net/gml' " +
    "xmlns:ogc='http://www.opengis.net/ogc' xmlns:wcs='http://www.opengis.net/wcs/1.1.1' " +
    "xmlns:xlink='http://www.w3.org/1999/xlink' " +
    "xsi:schemaLocation='http://www.opengis.net/wps/1.0.0 http://schemas.opengis.net/wps/1.0.0/wpsAll.xsd'>" +
      "<ows:Identifier>vec:Centroid</ows:Identifier>" +
      "<wps:DataInputs>" +
        "<wps:Input>" +
          "<ows:Identifier>features</ows:Identifier>" +
          "<wps:Reference mimeType='text/xml; subtype=gml/3.1.1' xlink:href='http://geoserver/wps' method='POST'>" +
            "<wps:Body>" +
              "<wps:Execute version='1.0.0' service='WPS'>" +
                "<ows:Identifier>gs:Clip</ows:Identifier>" +
                "<wps:DataInputs>" +
                  "<wps:Input>" +
                    "<ows:Identifier>features</ows:Identifier>" +
                    "<wps:Reference mimeType='text/xml' xlink:href='http://geoserver/wfs' method='POST'>" +
                      "<wps:Body>" +
                        "<wfs:GetFeature service='WFS' version='1.0.0' outputFormat='GML2' " +
                               "xmlns:topp='http://www.openplans.org/topp'>" +
                          "<wfs:Query typeName='topp:tasmania_roads'/>" +
                        "</wfs:GetFeature>" +
                      "</wps:Body>" +
                    "</wps:Reference>" +
                  "</wps:Input>" +
                  "<wps:Input>" +
                    "<ows:Identifier>clip</ows:Identifier>" +
                    "<wps:Data>" +
                      "<wps:ComplexData mimeType='application/wkt'><![CDATA[" +
                          "POLYGON((146 -41,146 -43,147 -43,147 -41,146 -41))]]></wps:ComplexData>" +
                    "</wps:Data>" +
                  "</wps:Input>" +
                "</wps:DataInputs>" +
                "<wps:ResponseForm>" +
                  "<wps:RawDataOutput mimeType='text/xml; subtype=wfs-collection/1.0'>" +
                    "<ows:Identifier>result</ows:Identifier>" +
                  "</wps:RawDataOutput>" +
                "</wps:ResponseForm>" +
              "</wps:Execute>" +
            "</wps:Body>" +
          "</wps:Reference>" +
        "</wps:Input>" +
      "</wps:DataInputs>" +
      "<wps:ResponseForm>" +
        "<wps:RawDataOutput mimeType='text/xml; subtype=gml/3.1.1'>" +
          "<ows:Identifier>result</ows:Identifier>" +
        "</wps:RawDataOutput>" +
      "</wps:ResponseForm>" +
    "</wps:Execute>";

    exports.buildExample = function () {
        var innerProcessClip = {
                identifier: "gs:Clip",
                inputs: [{
                    identifier: "features",
                    reference: {type: "wfs"},
                    typeName: "topp:tasmania_roads"
                }, {
                    identifier: "clip",
                    mimeType: "application/wkt",
                    data: "POLYGON((146 -41,146 -43,147 -43,147 -41,146 -41))"
                }],
                response: {
                    identifier: "result",
                    mimeType: "text/xml; subtype=wfs-collection/1.0"
                }
            },
            doc = wpsBuilder.build({
                identifier: "vec:Centroid",
                inputs: [{
                    identifier: "features",
                    subprocess: innerProcessClip
                }],
                response: {
                    identifier: "result",
                    mimeType: "mimeType='text/xml; subtype=gml/3.1.1",
                }
            });
        return doc;
    };
    exports.displayFeatureChaining = function () {
        var doc = exports.buildExample(),
            ser = wpsBuilder.serialize(doc);
        document.getElementById("left_code").innerText = vkbeautify.xml(ser);
        document.getElementById("right_code").innerText = vkbeautify.xml(exports.featureChainingExample);
        return true;
    };
})((typeof(exports) === "undefined") ? this.wpsBuilder.tests.featureChaining = {} : exports);
