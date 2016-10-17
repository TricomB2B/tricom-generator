/**
 *
 */

(function () {
    'use strict';

    angular
        .module('<%= camelCase %>Directive', [])
        .directive('<%= camelCase %>', <%= camelCase %>);

    /**
     * @return {[type]} [description]
     * @ngInject
     */
    function <%= camelCase %> () {
        return {
            restrict: 'A',
            link: link,
            scope: <%= isolateScope ? {} : "'@'" %>
        };
    }

    function link ($scope, $element, $attrs, $state) {

        var <%= controllerAs %> = this;

        <%= controllerAs %>.name = '<%= urlSafe %>';

    }

})();
