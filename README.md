##What is it?

A light-weight (and thus far from feature-complete) Javascript request-builder for [WPS-requests](http://en.wikipedia.org/wiki/Web_Processing_Service).  
It is limited to execute-request in order to reduce global complexity.  
this means that you - the developer - have to know:

  - which processes are available on the target-server and
  - which inputs the single processes expect.

## Getting started

1. define the process that you want to call, as a javascript object:

        var procDef = {identifier: "geo:envelope",
                  inputs: [{
                      identifier: "geom",
                      mimeType: "application/wkt",
                      data: "POLYGON((110 20,120 20,120 10,110 10,110 20)," +
                                    "(112 17,118 18,118 16,112 15,112 17))"
                  }],
                  response: {
                      identifier: "result",
                      mimeType: "application/wkt",
                 }
        };

1. build the xml-document:

        var doc = wpsBuilder.buildExample(procDef);

1. serialize the doc to string:

        var ser = wpsBuilder.serialize(doc);

1. call the wps server:

        var req = new XMLHttpRequest();
        req.open("POST", "http://localhost:8888/geoserver/wps/", true);
        req.onreadystatechange = function () {
            if (req.readyState != 4 || req.status != 200) return;
            responseHandler(req);
        };
        req.send(ser);

    NB: you may need to use a (reverse) proxy to access the WPS-server if you use the *wps_request_builder* in a web-page.  

    the reverse proxy will circumvent cross origin limitations.  
    there are many possible solutions, , e.g. 
    [tiniproxy](https://banu.com/tinyproxy/) which is lightweight.

1. handle the response

        responseHandler = function (req) {
            console.log(req.responseText);
        }

## What can be done

currently covered:

  - single WPS process:
    - Geometry (text or subprocess)
    - FeatureCollections (text, local layer or subprocess)
    - Coverage (local layer or subprocess)
  - chained WPS-processes:
    - combinations of single processes

## Tests
tests are in vanilla javascript (but make user of vkbeautify and underscore).  
see the tests folder.

##License

See LICENSE file in the project root.
