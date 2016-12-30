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
  * @ngInject
  */
  function <%= directive %> () {
    let directive = {
      restrict: 'A',
      link: link,
      <%= isolateScope ? 'scope: {}' : '' %>
    };
    return directive;

    /**
    * Link Function
    */
    function link (scope, element, attrs) {

    }
  }
})();
