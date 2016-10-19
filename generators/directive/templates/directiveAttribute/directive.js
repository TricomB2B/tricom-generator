/**
 *
 */

(function () {
    'use strict';

    angular
        .module('<%= prefix %><%= camelCase %>Directive', [])
        .directive('<%= prefix %><%= camelCase %>', <%= prefix %><%= camelCase %>);

    /**
     * @return {[type]} [description]
     * @ngInject
     */
    function <%= prefix %><%= camelCase %> () {
        return {
            restrict: 'A',
            link: link,
            <%= isolateScope ? 'scope: {}' : '' %>
        };
    }

    function link ($scope, $element, $attrs, $state) {

        var <%= controllerAs %> = this;

        <%= controllerAs %>.name = '<%= urlSafe %>';

    }

})();
