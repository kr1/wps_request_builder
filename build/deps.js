
var lib_files = {
    wps_builder: {
        src: ['wps_builder.js'],
        desc: 'the main file',
        heading: 'Main'
    },
    Helpers: {
        src: ['utils.js',
              'transport.js'],
        desc: 'the helpers',
        heading: 'Helpers'
    },
};

var test_files = {
    Tests: {
        src: ['../tests/geom_and_wfs_layer.js',
              '../tests/feature_chaining.js',
              '../tests/coverage_chaining.js',
              '../tests/coverage_import.js',
              '../tests/simple_geom.js',
              ],
        desc: 'the test files',
        heading: 'Tests'
    },
};

if (typeof exports !== 'undefined') {
    exports.lib_files = lib_files;
    exports.test_files = test_files;
};
