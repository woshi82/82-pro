module.exports = function(grunt) {

  // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        meta: {
            banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> */'
        },
        usebanner: {
            md5: {
                options: {
                    banner: '<%= meta.banner %>',
                },
                files: {
                    src: ['dist/*']
                }
            }
        },
        clean: {
            dist: ['dist']
        },
        uglify: {
            // options: {
            //   banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            // },
            js: {
                files: {
                    'dist/index.js': [
                        'js/jquery-1.11.2.min.js',
                        'js/create.js',
                        'js/index.js'
                    ]

                }
            }
        },
        cssmin: {
            'add_banner': {
                options: {
                    keepSpecialComments: 0 // removing all
                },
                files: {
                    'dist/style.css': [
                        'css/*.css'
                    ]
                }
            }
        },
        processhtml: {
            dist: {
                files: {
                    'index.html': ['index_dev.html']
                }
            }
        },
        hashres: {
            options: {
                encoding: 'utf8',
                fileNameFormat: '${name}.${hash}.${ext}',
                renameFiles: true
            },
            prod: {
                src: [
                    'dist/index.js',
                    'dist/style.css'
                ],
                dest: 'index.html',
            }
        },
        svgmin: {
            options: {
                plugins: [
                    {
                        removeViewBox: false
                    }, 
                    {
                        removeUselessStrokeAndFill: false
                    },
                    {removeUnknownsAndDefaults: false } ,
                    {cleanupIDs: false } 
                ]
            },
            dist: {
                files: {
                    'dist/p0.svg': 'svg/p0.svg',
                    'dist/p1.svg': 'svg/p1.svg',   
                    'dist/p2.svg': 'svg/p2.svg',   
                    'dist/p3.svg': 'svg/p3.svg',   
                    'dist/p4.svg': 'svg/p4.svg',   
                    'dist/p5.svg': 'svg/p5.svg',   
                    'dist/p6.svg': 'svg/p6.svg',   
                    'dist/p7.svg': 'svg/p7.svg'
                }
            }
        },
        htmlmin: {                                    
            dist: {                                    
              options: {                             
                removeComments: true,
                collapseWhitespace: true
              },
              files: {                                   
                'dist/p0.svg': 'index.html',    
                'dist/p1.svg': 'game.html'  
              }
            }
          }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-processhtml');
    grunt.loadNpmTasks('grunt-hashres');
    grunt.loadNpmTasks('grunt-banner');
    // grunt.loadNpmTasks('grunt-svgmin');
    // grunt.loadNpmTasks('grunt-contrib-htmlmin');

    // 默认被执行的任务列表。
    grunt.registerTask('default', [
        'clean:dist',
        'uglify',
        'cssmin',
        'processhtml',
        'hashres',
        'usebanner',
        // 'svgmin'
        // 'htmlmin'

    ]);

};