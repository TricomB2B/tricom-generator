/**
 *  <%= name %> View
 *  <%= description %>
 */

(function () {
  'use strict';

  angular
    .module('<%= module %>', [])
    .config(<%= config %>);

  /**
   * Route Configuration
   * @ngInejct
   */
  function <%= config %> ($stateProvider) {
    $stateProvider
      .state('<%= state %>', {
        url: '<%= url %>',
<% if (stateParams) { -%>
        resolve: {
<% for (let p of params) { -%>
          <%= p %>: function ($stateParams) {
            return $stateParams.<%= p %>;
          },
<% } -%>
        },
<% } -%>
        views: {
          'main@': {
            templateUrl: '<%= urlSafe %>.html',
            controller: <%= controller %>,
            controllerAs: '<%= controllerAs %>'
        }
      }
    });
  }

  /**
   * Controller
   * @ngInject
   */
<% if (stateParams) { -%>
  function <%= controller %> (<%= params.join(', ') %>) {
<% } else { -%>
  function <%= controller %> () {
<% } -%>
    let <%= controllerAs %> = this;

    <%= controllerAs %>.name = '<%= name %>';
  }
})();
