/**
 *  <%= camelCase %> View
 *  <%= description %>
 */

(function () {
    'use strict';

    angular
        .module('HomeView', [])
        .config(HomeConfig);

    function HomeConfig ($stateProvider) {
        $stateProvider
            .state('root.home', {
                url: '/',
                views: {
                    'main@': {
                        templateUrl: 'Home.html',
                        controller: HomeCtrl,
                        controllerAs: 'hom'
                    }
                }
            });
    }

    function HomeCtrl ($scope) {

        var hom = this;

        hom.name = 'Welcome';

    }
})();
