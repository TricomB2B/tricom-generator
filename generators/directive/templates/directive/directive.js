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
            restrict: '<%= attribute ? "AEC" : "E" %>',
            templateUrl: getView('<%= urlSafe %>'),
            scope: <%= isolateScope ? {} : "'@'" %>,
            controller: <%= camelCase %>Ctrl,
            consollerAs: '<%= controllerAs %>'
        };
    }

    function <%= camelCase %>Ctrl ($scope) {

        var <%= controllerAs %> = this;

        <%= controllerAs %>.name = '<%= urlSafe %>';

    }

})();
