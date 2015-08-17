(function(){
    'use strict';

    angular.module('core').directive('dynFbCommentBox', dynFbCommentBox);

    function dynFbCommentBox() {
        function createHTML(attrs) {
            return '<div class="fb-comments" ' +
                'data-href="' + attrs.href + '" ' +
                'data-numposts="' + attrs.numposts + '" ' +
                'data-colorsheme="' + attrs.colorscheme + '" ' +
                'data-width="' + attrs.width + '">' +
                '</div>';
        }

        return {
            restrict: 'A',
            scope: {},
            link: function postLink(scope, elem, attrs) {
                attrs.$observe('pageHref', function (newValue) {
                    var htmlAttrs = {
                        href            : newValue,
                        numposts        : attrs.numposts    || 5,
                        colorscheme     : attrs.colorscheme || 'light',
                        width           : attrs.width || '100%'
                    };

                    elem.html(createHTML(htmlAttrs));
                    FB.XFBML.parse(elem[0]);
                });
            }
        };
    }
}).call(this);


