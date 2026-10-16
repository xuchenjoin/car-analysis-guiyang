/*
 * grunt-marsRev
 * https://github.com/tdp100/grunt-marsRev
 *
 * Copyright (c) 2015 tangdeping
 * Licensed under the MIT license.
 */

'use strict';
var fs = require('fs');
module.exports = function (grunt) {
    // Project configuration.
    grunt.initConfig({
        //css array
        cssResources: [],
        remoteResource: {
            staticResourceServer:"/static/",
            frameResourceDir: "framework",
            businessResourceDir: "home"  
        },
        //清空build
        clean: {
            build: ['build']
        },
        //js语法检查
        jshint: {
            app: {
                files: {src: ['src/app/**/*.js']},
                options: {jshintrc: '.jshintrc'}
            }
        },

        //复制
        copy: {
            main: {
                files: [
                    {cwd:"theme/default/", src: ['**', '!less/**', '!fonts/*.*', '!images/*.*', '!css/*.css'], dest: 'build/theme/default', expand: true},
                    {cwd:"theme/default/", src: ['!images/gm/*.*','!images/icons/*.*','!images/menu/*.*','images/*.*'], dest: 'build/theme/default', expand: true},
                    {cwd:"theme/default/", src: ['css/business.customization.css'], dest: 'build/theme/default', expand: true},
                    {src: ['src/**', '!src/app/framework/controllers/**', '!src/app/framework/directive/**', '!src/app/framework/services/**', '!src/app/framework/views/**', '!src/app/framework/localization/**', '!src/app/services/**'], dest: 'build/', expand: true},
                    {src: ['theme/**', '!theme/hws/**', '!theme/private/**', '!theme/dt/**', '!theme/ocb/**','!theme/tlf-*/**', '!theme/ctc/**', '!theme/default/css/bootstrap.min.css', '!theme/default/css/frame*.css', '!theme/default/css/tiny*min.css', '!theme/default/fonts/frameIcomoon.*', '!theme/default/fonts/tinyFont.*', '!theme/default/fonts/glyphicons-halflings-regular.*', '!theme/default/images/**.**'], dest: 'build/', expand: true},
                    {src: 'index.html', dest: 'build/', expand: true},
                    {src: 'main.js', dest: 'build/', expand: true},
                    {src: 'lib/codeMirror/**', dest: 'build/', expand: true},
                    {src: 'base64.js', dest: 'build/', expand: true}
                ]
            },
            default: {
                files: [
                    {cwd:"i18n/default/", src: ['zh-cn/**', 'en-us/**', '!**/framework.js', '!**/widgetsLanguage.js', '!**/tiny2Language.js', '!**/framework.ext.js', '!**/framework.common.js'], dest: 'build/i18n/default/', expand: true}
                ]
            },
            hws: {
                files: [
                    {cwd:"theme/hws/", src: ['**', '!less/**', '!css/bootstrap.min.css', '!css/frame*.css', '!css/tiny*min.css', '!fonts/movistar*.*', '!fonts/tinyFont.*', '!images/**.**'], dest: 'build/theme/default', expand: true},
                    {cwd:"i18n/hws/", src: ['zh-cn/**', 'en-us/**', '!**/framework.js', '!**/widgetsLanguage.js', '!**/tiny2Language.js', '!**/framework.ext.js', '!**/framework.common.js'], dest: 'build/i18n/default/', expand: true}
                ]
            },
            "private": {
                files: [
                    {cwd:"theme/private/", src: ['**', '!less/**', '!css/bootstrap.min.css', '!css/frame*.css', '!css/tiny*min.css', '!fonts/movistar*.*', '!fonts/tinyFont.*', '!images/**.**'], dest: 'build/theme/default', expand: true},
                    {cwd:"i18n/private/", src: ['zh-cn/**', 'en-us/**', '!**/framework.js', '!**/widgetsLanguage.js', '!**/tiny2Language.js', '!**/framework.ext.js', '!**/framework.common.js'], dest: 'build/i18n/default/', expand: true}
                ]
            },
            "tlf-chile": {
                files: [
                    {cwd:"theme/tlf-mov/", src: ['**', '!less/**', '!css/bootstrap.min.css', '!css/frame*.css', '!css/tiny*min.css', '!fonts/movistar*.*', '!fonts/tinyFont.*', '!images/**.**'], dest: 'build/theme/default', expand: true},
                    {cwd:"i18n/tlf-chile/", src: ['**', '!**/framework.js', '!**/widgetsLanguage.js', '!**/tiny2Language.js', '!**/framework.ext.js'], dest: 'build/i18n/default/', expand: true}
                ]
            },
            "tlf-argent": {
                files: [
                    {cwd:"theme/tlf-mov/", src: ['**', '!less/**', '!css/bootstrap.min.css', '!css/frame*.css', '!css/tiny*min.css', '!fonts/movistar*.*', '!fonts/tinyFont.*', '!images/**.**'], dest: 'build/theme/default', expand: true},
                    {cwd:"i18n/tlf-argent/", src: ['**', '!**/framework.js', '!**/widgetsLanguage.js', '!**/tiny2Language.js', '!**/framework.ext.js'], dest: 'build/i18n/default/', expand: true}
                ]
            },
            "tlf-mexico": {
                files: [
                    {cwd:"theme/tlf-mov/", src: ['**', '!less/**', '!css/bootstrap.min.css', '!css/frame*.css', '!css/tiny*min.css', '!fonts/movistar*.*', '!fonts/tinyFont.*', '!images/**.**'], dest: 'build/theme/default', expand: true},
                    {cwd:"i18n/tlf-mexico/", src: ['**', '!**/framework.js', '!**/widgetsLanguage.js', '!**/tiny2Language.js', '!**/framework.ext.js'], dest: 'build/i18n/default/', expand: true}
                ]
            },
            "tlf-usa": {
                files: [
                    {cwd:"theme/tlf-global/", src: ['**', '!less/**', '!css/bootstrap.min.css', '!css/frame*.css', '!css/tiny*min.css', '!fonts/TelefonicaWeb*.*', '!fonts/tinyFont.*', '!images/**.**'], dest: 'build/theme/default', expand: true},
                    {cwd:"i18n/tlf-usa/", src: ['**', '!**/framework.js', '!**/widgetsLanguage.js', '!**/tiny2Language.js', '!**/framework.ext.js'], dest: 'build/i18n/default/', expand: true}
                ]
            },
            "tlf-peru": {
                files: [
                    {cwd:"theme/tlf-global/", src: ['**', '!less/**', '!css/bootstrap.min.css', '!css/frame*.css', '!css/tiny*min.css', '!fonts/TelefonicaWeb*.*', '!fonts/tinyFont.*', '!images/**.**'], dest: 'build/theme/default', expand: true},
                    {cwd:"i18n/tlf-peru/", src: ['**', '!**/framework.js', '!**/widgetsLanguage.js', '!**/tiny2Language.js', '!**/framework.ext.js'], dest: 'build/i18n/default/', expand: true}
                ]
            },
            "tlf-spain": {
                files: [
                    {cwd:"theme/tlf-global/", src: ['**', '!less/**', '!css/bootstrap.min.css', '!css/frame*.css', '!css/tiny*min.css', '!fonts/TelefonicaWeb*.*', '!fonts/tinyFont.*', '!images/**.**'], dest: 'build/theme/default', expand: true},
                    {cwd:"i18n/tlf-spain/", src: ['**', '!**/framework.js', '!**/widgetsLanguage.js', '!**/tiny2Language.js', '!**/framework.ext.js'], dest: 'build/i18n/default/', expand: true}
                ]
            },
            "tlf-vivo": {
                files: [
                    {cwd:"theme/tlf-vivo/", src: ['**', '!less/**', '!css/bootstrap.min.css', '!css/frame*.css', '!css/tiny*min.css', '!fonts/OfficinaSerifITCTT*.*', '!fonts/tinyFont.*', '!images/**.**'], dest: 'build/theme/default', expand: true},
                    {cwd:"i18n/tlf-vivo/", src: ['**', '!**/framework.js', '!**/widgetsLanguage.js', '!**/tiny2Language.js', '!**/framework.ext.js'], dest: 'build/i18n/default/', expand: true}
                ]
            },
            dt: {
                files: [
                    {cwd:"theme/dt/", src: ['**', '!less/**', '!css/bootstrap.min.css', '!css/frame*.css', '!css/tiny*min.css', '!fonts/telegrotesk-webfont.*', '!fonts/tinyFont.*', '!images/**.**'], dest: 'build/theme/default', expand: true},
                    {cwd:"i18n/dt/", src: ['**', '!**/framework.js', '!**/widgetsLanguage.js', '!**/tiny2Language.js', '!**/framework.ext.js'], dest: 'build/i18n/default/', expand: true}
                ]
            },
            ctc: {
                files: [
                    {cwd:"theme/ctc/", src: ['**', '!less/**', '!css/bootstrap.min.css', '!css/frame*.css', '!css/tiny*min.css', '!fonts/tinyFont.*', '!images/**.**'], dest: 'build/theme/default', expand: true},
                    {cwd:"i18n/ctc/", src: ['**', '!**/framework.js', '!**/widgetsLanguage.js', '!**/tiny2Language.js', '!**/framework.ext.js'], dest: 'build/i18n/default/', expand: true}
                ]
            },
            
            ocb: {
                files: [
                    {cwd:"theme/ocb/", src: ['**', '!less/**', '!css/bootstrap.min.css', '!css/frame*.css', '!css/tiny*min.css', '!fonts/HelvNeue*.*','!fonts/tinyFont.*', '!images/**.**'], dest: 'build/theme/default', expand: true},
                    {cwd:"i18n/ocb/", src: ['**', '!**/framework.js', '!**/widgetsLanguage.js', '!**/tiny2Language.js', '!**/framework.ext.js'], dest: 'build/i18n/default/', expand: true}
                ]
            },

            all_main: {
                files: [
                    {src: 'lib/**', dest: 'build/', expand: true},
                    {src: 'src/**', dest: 'build/', expand: true},
                    {src: ['theme/default/**', '!theme/default/**.css'], dest: 'build/', expand: true},
                    {src: 'index.html', dest: 'build/', expand: true},
                    {src: 'main.js', dest: 'build/', expand: true},
                    {src: 'urlDeal.js', dest: 'build/', expand: true},
                    {src: 'browserChecker.js', dest: 'build/', expand: true},
                    {src: 'lib/analysis.js', dest: 'build/', expand: true},
		            {src: 'es5-func-polyfill.js', dest: 'build/', expand: true},
                    {src: 'base64.js', dest: 'build/', expand: true}
                ]
            },
            all_default: {
                files: [
                    {cwd:"i18n/default/", src: ['en-us/**','zh-cn/**'], dest: 'build/i18n/default/', expand: true},
                    {cwd:"i18n/common/", src: ['en-us/**','zh-cn/**'], dest: 'build/i18n/default/', expand: true}
                ]
            },
            all_other: {
                files: [
                    {src: 'error/**', dest: 'build/', expand: true}
                ]
            }
        },

        //搜索要合并的css, 并替换文本
        replace: {
            dt: {
                files: [
                    {
                        dest: 'build/',
                        expand: true,
                        src: ['src/app/framework/views/*.html', 'main.js', 'src/app/framework/framework.js']
                    }
                ],
                options: {
                    patterns: [
                        {
                            match: /(\<\!\-\-menus\-default\-start[\s\S]*menus\-default\-end\-\-\>)|(\/\/menus\-hws\-start[\s\S]*\/\/menus\-hws\-end)/,
                            replacement: function () {
                                return "";
                            }
                        }
                    ]
                }
            },
            "tlf-vivo": {
                files: [
                    {
                        dest: 'build/',
                        expand: true,
                        src: ['src/app/framework/views/*.html', 'main.js', 'src/app/framework/framework.js']
                    }
                ],
                options: {
                    patterns: [
                        {
                            match: /(\<\!\-\-menus\-dt\-start[\s\S]*menus\-dt\-end\-\-\>)|(\/\/menus\-hws\-start[\s\S]*\/\/menus\-hws\-end)/,
                            replacement: function () {
                                return "";
                            }
                        }
                    ]
                }
            },
            "tlf-usa": {
                files: [
                    {
                        dest: 'build/',
                        expand: true,
                        src: ['src/app/framework/views/*.html', 'main.js', 'src/app/framework/framework.js']
                    }
                ],
                options: {
                    patterns: [
                        {
                            match: /(\<\!\-\-menus\-dt\-start[\s\S]*menus\-dt\-end\-\-\>)|(\/\/menus\-hws\-start[\s\S]*\/\/menus\-hws\-end)/,
                            replacement: function () {
                                return "";
                            }
                        }
                    ]
                }
            },
            "tlf-peru": {
                files: [
                    {
                        dest: 'build/',
                        expand: true,
                        src: ['src/app/framework/views/*.html', 'main.js', 'src/app/framework/framework.js']
                    }
                ],
                options: {
                    patterns: [
                        {
                            match: /(\<\!\-\-menus\-dt\-start[\s\S]*menus\-dt\-end\-\-\>)|(\/\/menus\-hws\-start[\s\S]*\/\/menus\-hws\-end)/,
                            replacement: function () {
                                return "";
                            }
                        }
                    ]
                }
            },
            "tlf-mexico": {
                files: [
                    {
                        dest: 'build/',
                        expand: true,
                        src: ['src/app/framework/views/*.html', 'main.js', 'src/app/framework/framework.js']
                    }
                ],
                options: {
                    patterns: [
                        {
                            match: /(\<\!\-\-menus\-dt\-start[\s\S]*menus\-dt\-end\-\-\>)|(\/\/menus\-hws\-start[\s\S]*\/\/menus\-hws\-end)/,
                            replacement: function () {
                                return "";
                            }
                        }
                    ]
                }
            },
            "tlf-chile": {
                files: [
                    {
                        dest: 'build/',
                        expand: true,
                        src: ['src/app/framework/views/*.html', 'main.js', 'src/app/framework/framework.js']
                    }
                ],
                options: {
                    patterns: [
                        {
                            match: /(\<\!\-\-menus\-dt\-start[\s\S]*menus\-dt\-end\-\-\>)|(\/\/menus\-hws\-start[\s\S]*\/\/menus\-hws\-end)/,
                            replacement: function () {
                                return "";
                            }
                        }
                    ]
                }
            },
            "tlf-argent": {
                files: [
                    {
                        dest: 'build/',
                        expand: true,
                        src: ['src/app/framework/views/*.html', 'main.js', 'src/app/framework/framework.js']
                    }
                ],
                options: {
                    patterns: [
                        {
                            match: /(\<\!\-\-menus\-dt\-start[\s\S]*menus\-dt\-end\-\-\>)|(\/\/menus\-hws\-start[\s\S]*\/\/menus\-hws\-end)/,
                            replacement: function () {
                                return "";
                            }
                        }
                    ]
                }
            },
            "tlf-spain": {
                files: [
                    {
                        dest: 'build/',
                        expand: true,
                        src: ['src/app/framework/views/*.html', 'main.js', 'src/app/framework/framework.js']
                    }
                ],
                options: {
                    patterns: [
                        {
                            match: /(\<\!\-\-menus\-dt\-start[\s\S]*menus\-dt\-end\-\-\>)|(\/\/menus\-hws\-start[\s\S]*\/\/menus\-hws\-end)/,
                            replacement: function () {
                                return "";
                            }
                        }
                    ]
                }
            },
            default: {
                files: [
                    {
                        dest: 'build/',
                        expand: true,
                        src: ['src/app/framework/views/*.html', 'main.js', 'src/app/framework/framework.js']
                    }
                ],
                options: {
                    patterns: [
                        {
                            match: /(\<\!\-\-menus\-dt\-start[\s\S]*menus\-dt\-end\-\-\>)|(\/\/menus\-hws\-start[\s\S]*\/\/menus\-hws\-end)/,
                            replacement: function () {
                                return "";
                            }
                        }
                    ]
                }
            },
            hws: {
                files: [
                    {
                        dest: 'build/',
                        expand: true,
                        src: ['src/app/framework/views/*.html', 'main.js', 'src/app/framework/framework.js']
                    }
                ],
                options: {
                    patterns: [
                        {
                            match: /\<\!\-\-menus\-dt\-start[\s\S]*menus\-dt\-end\-\-\>/,
                            replacement: function () {
                                return "";
                            }
                        }
                    ]
                }
            },
            "private": {
                files: [
                    {
                        dest: 'build/',
                        expand: true,
                        src: ['src/app/framework/views/*.html', 'main.js', 'src/app/framework/framework.js']
                    }
                ],
                options: {
                    patterns: [
                        {
                            match: /(\<\!\-\-menus\-dt\-start[\s\S]*menus\-dt\-end\-\-\>)|(\/\/menus\-hws\-start[\s\S]*\/\/menus\-hws\-end)/,
                            replacement: function () {
                                return "";
                            }
                        }
                    ]
                }
            },
            "ocb": {
                files: [
                    {
                        dest: 'build/',
                        expand: true,
                        src: ['src/app/framework/views/*.html', 'main.js', 'src/app/framework/framework.js']
                    }
                ],
                options: {
                    patterns: [
                        {
                            match: /(\<\!\-\-menus\-dt\-start[\s\S]*menus\-dt\-end\-\-\>)|(\/\/menus\-hws\-start[\s\S]*\/\/menus\-hws\-end)/,
                            replacement: function () {
                                return "";
                            }
                        }
                    ]
                }
            },
            "ctc": {
                files: [
                    {
                        dest: 'build/',
                        expand: true,
                        src: ['src/app/framework/views/*.html', 'main.js', 'src/app/framework/framework.js']
                    }
                ],
                options: {
                    patterns: [
                        {
                            match: /(\<\!\-\-menus\-dt\-start[\s\S]*menus\-dt\-end\-\-\>)|(\/\/menus\-hws\-start[\s\S]*\/\/menus\-hws\-end)/,
                            replacement: function () {
                                return "";
                            }
                        }
                    ]
                }
            },

            gather: {
                files: [
                    {
                        dest: 'build/',
                        expand: true,
                        src: ['index.html']
                    }
                ],
                options: {
                    patterns: [
                        {
                            //Grab the <!--business-js-start--> and <!--business-js-end--> comments and everything in-between
                            match: /\<\!\-\-business\-css\-start[\s\S]*business\-css\-end\-\-\>/,
                            replacement: function (matchedString) {
                                //Grab all of the href attributes from the <href> tags
                                var tmpTarget = target;
                                if(target === 'tlf-chile' || target === 'tlf-argent' || target === 'tlf-mexico') {
                                    tmpTarget = 'tlf-mov';
                                }
                                if(target === 'tlf-usa' || target === 'tlf-peru' || target === 'tlf-spain') {
                                    tmpTarget = 'tlf-global';
                                }
                                var regExp = new RegExp('<\\!\\-\\-css\\-' + tmpTarget + '\\-start[\\s\\S]*css\\-' + tmpTarget + '\\-end\\-\\-\\>');
                                var matchArrary = matchedString.match(regExp);
                                if(!matchArrary || matchArrary.length !== 1) {
                                    console.error(regExp.source + ' match result is wrong');
                                    return matchedString;
                                }
                                var cssArray = matchArrary[0].match(/(href\s?\=\s?[\'\"])([^\'\"]*)([\'\"])/g);
                                if(cssArray) {
                                    cssArray.forEach(function (element) {
                                        var resourceTarget = element.match(/(href\s?\=\s?[\'\"])([^\'\"]*)([\'\"])/)[2];
                                        var spriteTarget = resourceTarget.match(/(.*)(.css)/);
                                        if (spriteTarget !== null) {
                                            var targetConfig = grunt.config('cssResources');
                                            //check sprite css is exist
                                            var spritePath = spriteTarget[1] + "-sprite.css";
                                            var exists = fs.existsSync(spritePath);
                                            //Alter the path for use with the concat task
                                            if (exists) {
                                                console.log("has sprite css file, name=", spritePath);
                                                //Alter the path for use with the concat task
                                                targetConfig.push(spritePath);
                                            } else {
                                                console.log("no sprite css file, name=", resourceTarget);
                                                targetConfig.push(resourceTarget);
                                            }
                                            //Add the path to the CSS file to the cssResources configuration property
                                            grunt.config('cssResources', targetConfig);
                                        }

                                    });
                                    //Replace the entire business-css-start to business-css-end block with this <link> tag
                                    return '<link rel="stylesheet" type="text/css"  href="theme/default/css/combined-business.min.css"/>';
                                } else {
                                    //Replace the entire business-css-start to business-css-end block with this <link> tag
                                    return '';
                                }
                            }
                        },
                        {
                            //Grab the <!--framework-js-start--> and <!--framework-js-end--> comments and everything in-between
                            match: /\<\!\-\-framework\-css\-start[\s\S]*framework\-css\-end\-\-\>/,
                            replacement: function () {
                                //Replace the entire business-css-start to business-css-end block with this <link> tag
                                return '<link rel="stylesheet" type="text/css"  href="theme/default/css/combined-framework.min.css"/>';
                            }
                        }
                    ]
                }
            },
            frameworkJs: {
                files: [
                    {
                        dest: './',
                        expand: false,
                        src: ['build/src/app/framework/framework.js']
                    }
                ],
                options: {
                    patterns: [
                        {
                            match: /\/\/static.console.hwclouds.com\//g,
                            replacement: '<%= grunt.config("remoteResource").staticResourceServer %>'
                        }
                    ]
                }
            },
            fixtures: {
                files: [
                    {
                        dest: './',
                        expand: true,
                        src: ['build/**/**.js']
                    }
                ],
                options: {
                    patterns: [
                        {
                            match: /define\s*\(\s*((\'|\")[\w\d\-_\/.!\,\:\[\]]+(\'|")\s*,?\s*)*\s*\[\s*((\'|")[\w\d\-_\/.!\,\:\[\]]+(\'|")\s*,?\s*)*\s*\]/ig,

                            replacement: function (matchedString) {
                                return matchedString.replace(/(\'|")fixtures(\/[\w]+)+(\'|")/g, '""');
                            }
                        }
                    ]
                }
            },
            all_gather: {
                files: [
                    {
                        dest: 'build/',
                        expand: true,
                        src: ['index.html']
                    }
                ],
                options: {
                    patterns: [
                        {
                            //Grab the <!--business-js-start--> and <!--business-js-end--> comments and everything in-between
                            match: /\<\!\-\-business\-css\-start[\s\S]*business\-css\-end\-\-\>/,
                            replacement: function (matchedString) {
                                //Grab all of the href attributes from the <href> tags
                                var regExp = new RegExp('<\\!\\-\\-css\\-' + target + '\\-start[\\s\\S]*css\\-' + target + '\\-end\\-\\-\\>');
                                var matchArrary = matchedString.match(regExp);
                                if(!matchArrary || matchArrary.length !== 1) {
                                    console.error(regExp.source + ' match result is wrong');
                                    return matchedString;
                                }
                                var cssArray = matchArrary[0].match(/(href\s?\=\s?[\'\"])([^\'\"]*)([\'\"])/g);
                                if(cssArray) {
                                    cssArray.forEach(function (element) {
                                        var resourceTarget = element.match(/(href\s?\=\s?[\'\"])([^\'\"]*)([\'\"])/)[2];
                                        var spriteTarget = resourceTarget.match(/(.*)(.css)/);
                                        if (spriteTarget !== null) {
                                            var targetConfig = grunt.config('cssResources');
                                            //check sprite css is exist
                                            var spritePath = spriteTarget[1] + "-sprite.css";
                                            var exists = fs.existsSync(spritePath);
                                            //Alter the path for use with the concat task
                                            if (exists) {
                                                console.log("has sprite css file, name=", spritePath);
                                                //Alter the path for use with the concat task
                                                targetConfig.push(spritePath);
                                            } else {
                                                console.log("no sprite css file, name=", resourceTarget);
                                                targetConfig.push(resourceTarget);
                                            }
                                            //Add the path to the CSS file to the cssResources configuration property
                                            grunt.config('cssResources', targetConfig);
                                        }

                                    });
                                    //Replace the entire business-css-start to business-css-end block with this <link> tag
                                    return '';
                                } else {
                                    //Replace the entire business-css-start to business-css-end block with this <link> tag
                                    return '';
                                }
                            }
                        },
                        {
                            match: /\<\!\-\-framework\-css\-start[\s\S]*framework\-css\-end\-\-\>/,
                            replacement: function (matchedString) {
                                //Grab all of the href attributes from the <href> tags
                                var regExp = new RegExp('<\\!\\-\\-css\\-' + target + '\\-start[\\s\\S]*css\\-' + target + '\\-end\\-\\-\\>');
                                var matchArrary = matchedString.match(regExp);
                                if(!matchArrary || matchArrary.length !== 1) {
                                    console.error(regExp.source + ' match result is wrong');
                                    return matchedString;
                                }
                                var cssArray = matchArrary[0].match(/(href\s?\=\s?[\'\"])([^\'\"]*)([\'\"])/g);
                                if(cssArray) {
                                    cssArray.forEach(function (element) {
                                        var resourceTarget = element.match(/(href\s?\=\s?[\'\"])([^\'\"]*)([\'\"])/)[2];
                                        var spriteTarget = resourceTarget.match(/(.*)(.css)/);
                                        if (spriteTarget !== null) {
                                            var targetConfig = grunt.config('cssResources');
                                            //check sprite css is exist
                                            var spritePath = spriteTarget[1] + "-sprite.css";
                                            var exists = fs.existsSync(spritePath);
                                            //Alter the path for use with the concat task
                                            if (exists) {
                                                console.log("has sprite css file, name=", spritePath);
                                                //Alter the path for use with the concat task
                                                targetConfig.push(spritePath);
                                            } else {
                                                console.log("no sprite css file, name=", resourceTarget);
                                                targetConfig.push(resourceTarget);
                                            }
                                            //Add the path to the CSS file to the cssResources configuration property
                                            grunt.config('cssResources', targetConfig);
                                        }

                                    });
                                    //Replace the entire business-css-start to business-css-end block with this <link> tag
                                    return '<link rel="stylesheet" type="text/css"  href="theme/default/css/combined.min.css"/>';
                                } else {
                                    //Replace the entire business-css-start to business-css-end block with this <link> tag
                                    return '<link rel="stylesheet" type="text/css"  href="theme/default/css/combined.min.css"/>';
                                }
                            }
                        }
                    ]
                }
            },
            all_i18n: {
                files: [
                    {
                        cwd: 'build/',
                        dest: 'build/',
                        expand: true,
                        src: ['i18n/default/**/framework.js']
                    }
                ],
                options: {
                    patterns: [
                        {
                            match: /i18n\/common\/.*\/framework.common/,
                            replacement: function () {
                                return "language-remote/framework.common";
                            }
                        }
                    ]
                }
            }
        },

        //css 合并
        concat: {
            css: {
                //Concatenate all of the files in the cssResources configuration property
                src: ['<%= cssResources %>'],
                dest: 'build/theme/default/css/combined-business.min.css'
            },
            all_css: {
                //Concatenate all of the files in the cssResources configuration property
                src: ['<%= cssResources %>'],
                dest: 'build/theme/default/css/combined.min.css'
            }
        },

        //css 压缩
        cssmin: {
            options: {
                compatibility: {
                    properties: {
                        urlQuotes: true
                    }
                }
            },
            target: {
                files: [{
                    expand: true,
                    src: ['build/theme/default/**/*.css']
                }]
            }
        },

        //压缩
        uglify: {
            min: {
                options: {
                    nameCache: false,
                    screwIE8: true,
                    compress: {
                        drop_console: true,
                        join_vars: false,
                        negate_iife: false,
                        sequences: false,
                        hoist_vars: true,
                        if_return: false
                    },
                    mangle: false,
                    beautify: {
                        quote_keys: true,
                        quote_style: 1
                    }
                },
                files: [
                    {cwd:"build/", src: ["i18n/**/*.js", '!i18n/**/*.min.js', '!i18n/**/*-min.js', '!i18n/**/framework.js'], dest: "build/", expand: true},
                    {cwd:"build/", src: ["src/**/*.js", '!src/**/*.min.js','!src/app/framework/**', '!src/app/services/**'], dest: "build/", expand: true},
                    {cwd:"build/", src: ['src/app/framework/framework.js'], dest: "build/", expand: true},
                    {cwd:"build/", src: ['src/app/framework/configures/frameworkRouterConfig.js'], dest: "build/", expand: true},
                    {cwd:"build/", src: ['main.js'], dest: "build/", expand: true},
                    {cwd:"build/", src: ['base64.js'], dest: "build/", expand: true}
                ]
            },
            all_min: {
                options: {
                    nameCache: false,
                    screwIE8: true,
                    compress: {
                        drop_console: true,
                        join_vars: false,
                        negate_iife: false,
                        sequences: false,
                        hoist_vars: true,
                        if_return: false
                    },
                    mangle: false,
                    beautify: {
                        quote_keys: true,
                        quote_style: 1
                    }
                },
                files: [
                    {cwd:"build", src: ["i18n/**/*.js", '!i18n/**/*.min.js'], dest: "build/", expand: true},
                    {src: ["lib/**/*.js", '!lib/**/*.min.js', '!lib/tiny/tiny*all.js'], dest: "build/", expand: true},
                    {src: ["src/**/*.js", '!src/**/*.min.js'], dest: "build/", expand: true},
                    {src: ["main.js"], dest: "build/", expand: true},
                    {src: ["urlDeal.js"], dest: "build/", expand: true},
                    {src: ["browserChecker.js"], dest: "build/", expand: true},
		            {src: ["es5-func-polyfill.js"], dest: "build/", expand: true},
                    {src: ["base64.js"], dest: "build/", expand: true}

                ]
            }
        },

        //hash
        marsRev: {
            options: {
                hash: {
                    algorithm: 'md5',             //hash算法
                    inputEncoding: 'utf8',        //文件编码
                    length: 7                     //hash命名的长度
                },
                require: {
                    requireJsPath: 'lib/require.js', //require.js的路径
                    dataMainPath: 'build/main.js',   //data-main 文件的路径
                    configJSON: 'main.json',         //require.config中的配置提取到单独的json文件中
                    accessHtml: 'build/index.html'   //引入require.js的html文件
                },
                cwd: 'build',                       //必填, 要hash的所有文件的目录名
                files: [
                    {src: ['/', '!i18n/default/zh-cn', '!i18n/default/de-de', '!i18n/default/fr-fr', '!i18n/default/es-es', '!i18n/default/pt-br']}
                ]
            }
        },

        //replace path and url
        replace_url: {
            framework: {
                options: {
                    remoteUrl: function() {
                        var remoteResource = grunt.config("remoteResource");
                        var target = grunt.option('target');
                        if(!target) {
                            target = 'default';
                        }
                        var staticServer = remoteResource.staticResourceServer;
                        var remoteResourcePath;
                        if(staticServer) {
                            if (staticServer.charAt(staticServer.length - 1) === '/') {
                                remoteResourcePath = remoteResource.staticResourceServer + remoteResource.frameResourceDir;
                            } else {
                                remoteResourcePath = remoteResource.staticResourceServer + '/' + remoteResource.frameResourceDir;
                            }
                            if (remoteResource.frameworkVersion) {
                                remoteResourcePath = remoteResourcePath + '/' + remoteResource.frameworkVersion;
                            }
                        }
                        return remoteResourcePath;
                    },
                    mainJs: {
                        filePath: 'build/main.js',   //data-main 文件的路径
                        configFile: 'main.json',
                        remotePaths: ["can", "app-remote", "angular", "ui-router", "bootstrap", "moment",
                            "language-remote", "lazy-load", "remote-lib","angular-echarts"]
                    },
                    cwd: 'build',                       //必填, 要hash的所有文件的目录名
                    targetFiles: [{src: ['index.html', 'src/app/framework/configures/frameworkRouterConfig.js']}],
                    files: [
                        {src: ['./theme/default/images/favicon.ico', './theme/default/css/combined-framework.min.css', './theme/default/css/bootstrap.min.css','./theme/default/css/framework.customization.css',
                            './urlDeal.js', './browserChecker.js', './es5-func-polyfill.js', './lib/require.js', './lib/tiny/tiny.min.js', 'src/app/framework/views/nonsupportRegion.html', 'src/app/framework/views/accessDeclined.html',
                            'src/app/framework/views/beingMaintained.html', './lib/tiny/tiny2.min.js', './lib/tiny/tiny.3lib.min.js', './theme/default/css/tiny2.min.css']}
                    ]
                }
            },
            business: {
                options: {
                    remoteUrl: function() {
                        var remoteResource = grunt.config("remoteResource");
                        var target = grunt.option('target');
                        if(!target) {
                            target = 'default';
                        }
                        var staticServer = remoteResource.staticResourceServer;
                        var remoteResourcePath;
                        if(staticServer) {
                            if (staticServer.charAt(staticServer.length - 1) === '/') {
                                remoteResourcePath = remoteResource.staticResourceServer + remoteResource.businessResourceDir;
                            } else {
                                remoteResourcePath = remoteResource.staticResourceServer + '/' + remoteResource.businessResourceDir;
                            }
                        }
                        return remoteResourcePath;
                    },
                    mainJs: {
                        filePath: 'build/main.js',   //data-main 文件的路径
                        configFile: 'main.json',
                        remotePaths: ["language", "business-app-remote"]
                    },
                    cwd: 'build',                       //必填, 要hash的所有文件的目录名
                    targetFiles: [{src: ['/']}],
                    files: [
                        {src: ['theme/default']}
                    ]
                }
            }
        }
        
       /* htmlmin: {                                     // Task
            dist: {                                      // Target
                options: {                                 // Target options
                    removeComments: true
                },
                files: {                                   // Dictionary of files
                    'build/index.html': 'build/index.html'
                }
            }
        }*/
    });
    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-replace-url');
    grunt.loadNpmTasks('grunt-marsrev');
    grunt.loadNpmTasks('grunt-safety');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-replace');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    /*grunt.loadNpmTasks('grunt-contrib-htmlmin');*/

    var target = grunt.option('target');
    if(!target) {
        target = 'default';
    }

    var model = grunt.option('model');

    if(model !== 'all') {
        grunt.registerTask('package', ['clean:build', 'copy:main', 'copy:'+target, 'replace:gather', 'replace:'+target, 'concat:css', 'cssmin',
            'uglify:min', 'replace:frameworkJs', 'replace_url:framework', /*'replace_url:business',*/ 'replace:fixtures']);
    } else {
        grunt.registerTask('package', ['clean:build', 'copy:all_main', 'copy:all_'+target, 'replace:all_gather', 'replace:all_i18n', 'replace:'+target, 'concat:all_css', 'cssmin',
            'uglify:all_min', 'marsRev', 'copy:all_other', 'replace:fixtures']);
    }


    grunt.registerTask('css', ['clean:build', 'copy', 'replace:gather', 'concat', 'cssmin']);

    grunt.registerTask('ci-checks', ['jshint']);

    // By default, lint and run all tests.
    grunt.registerTask('default', ['package']);
};