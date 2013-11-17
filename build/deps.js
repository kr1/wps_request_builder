
var deps = {
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
    Tests: {
        src: ['../tests/geom_and_wfs_layer.js',
              '../tests/geom_chaining.js',
              '../tests/simple_geom.js',
              ],
        desc: 'the helpers',
        heading: 'Helpers'
    },
}
if (typeof exports !== 'undefined') {
    exports.deps = deps;
}
