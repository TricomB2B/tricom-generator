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
            restrict: '<%= attribute ? "AEC" : "E" %>',
            templateUrl: getTemplateUrl('<%= prefix %>-<%= urlSafe %>'),
            controller: <%= camelCase %>Ctrl,
            controllerAs: '<%= controllerAs %>'
            <%= isolateScope ? 'scope: {}' : '' %>
        };
    }

    function <%= camelCase %>Ctrl ($scope) {

        var <%= controllerAs %> = this;

        <%= controllerAs %>.name = '<%= urlSafe %>';

    }

})();
