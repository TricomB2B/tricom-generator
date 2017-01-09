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
      restrict: '<%= element ? 'E' : '' %><%= attribute ? 'A' : '' %>',
<% if (element) { -%>
      templateUrl: '<%= urlSafe %>.html',
      controller: <%= controller %>,
      controllerAs: '<%= controllerAs %>',
<% } else { -%>
      link: link,
<% } -%>
      <%= isolateScope ? 'scope: {}' : '' %>
    };
    return directive;

<% if (!element) { -%>
    /**
    * Link Function
    */
    function link (scope, element, attrs) {

    }
<% } -%>
  }

<% if (element) { -%>
  /**
   * Controller
   * @ngInject
   */
  function <%= controller %> () {
    const <%= controllerAs %> = this;

    <%= controllerAs %>.name = '<%= name %>';
  }
<% } -%>
})();
