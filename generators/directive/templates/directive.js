/**
 * <%= description %>
 * @author
 */

(function () {
  'use strict';

  angular
    .module('<%= module %>', [])
    .directive('<%= directive %>', <%= directive %>);

  /**
  * Directive Definition
  */
  function <%= directive %> () {
    let directive = {
      restrict: '<%= element ? 'E' : '' %><%= attribute ? 'A' : '' %>',
      templateUrl: '<%= urlSafe %>.html',
      controller: <%= controller %>,
      controllerAs: '<%= controllerAs %>',
      <%= isolateScope ? 'scope: {}' : '' %>
    };
    return directive;
  }

  /**
   * Controller
   * @ngInject
   */
  function <%= controller %> () {
    const <%= controllerAs %> = this;

    <%= controllerAs %>.name = '<%= name %>';
  }
})();
