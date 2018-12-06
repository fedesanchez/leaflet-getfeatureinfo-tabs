module.exports = function(grunt) {

  var banner = '/*! Version: <%= pkg.version %>\nCopyright (c) 2018 Federico Sanchez */\n';

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: banner,
        preserveComments: false,
        sourceMap: false
      },
      build: {
        src: 'src/Leaflet.Control.GetFeatureInfoTabs.js',
        dest: 'dist/Leaflet.Control.GetFeatureInfoTabs.min.js'
      }
    },
    connect: {
      server: {
        options: {
          port: 9000,
          protocol: 'http',
          keepalive: true
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-connect');

  // Default task(s).
  grunt.registerTask('default', ['uglify']);

};
