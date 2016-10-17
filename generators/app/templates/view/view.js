/**
 *  <%= camelCase %> View
 *  <%= description %>
 */

(function () {
    'use strict';

    angular
        .module('<%= camelCase %>View', [])
        .config(<%= camelCase %>Config);

    function <%= camelCase %>Config ($stateProvider) {
        $stateProvider
            .state('<%= lowerCase %>', {
                url: '/',
                views: {
                    'main@': {
                        templateUrl: getView('<%= lowerCase %>'),
                        controller: <%= camelCase %>Ctrl,
                        controllerAs: '<%= controllerAs %>'
                    }
                }
            });
    }

    function <%= camelCase %>Ctrl ($scope) {

        var <%= controllerAs %> = this;

        <%= controllerAs %>.name = '<%= camelCase =>';

    }
})();
