/**
 *
 */

(function () {

  'use strict';

  angular
    .module('<%= camelCase %>Factory', [])
    .factory('<%= camelCase %>Factory', <%= camelCase %>Factory);

  /**
   * @param {[type]} <%= camelCase %>Factory [description]
   * @ngInject
   */
  function <%= camelCase %>Factory () {
    var data = {};

    var factory = {
      initialize: initialize,
      //!!FC!!// DO NOT REMOVE IF USING GENERATOR //
    };
    return factory;

    /**
     * [initialize description]
     * @return {[type]} [description]
     */
    function initialize() {
      console.log('<%= camelCase %>Factory init')
    }

    //!!FF!!// DO NOT REMOVE IF USING GENERATOR //
  }

})();
