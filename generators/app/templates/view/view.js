/**
 *  <%= camelCase %> View
 *  <%= description %>
 */

(function () {
  'use strict';

  angular
    .module('HomeView', [])
    .config(HomeConfig);

  /**
   * Route Configuration
   * @ngInject
   */
  function HomeConfig ($stateProvider) {
    $stateProvider
      .state('root.home', {
        url: '/',
        views: {
          'main@': {
            templateUrl: 'home.html',
            controller: HomeCtrl,
            controllerAs: 'vm'
          }
        }
      });
  }

  /**
   * Controller
   * @ngInject
   */
  function HomeCtrl ($scope) {
    const vm = this;

    vm.name = 'Welcome';
  }
})();
