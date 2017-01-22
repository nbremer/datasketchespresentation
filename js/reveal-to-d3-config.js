/* global d3 */

var pt = pt || {};

pt.slideIdToFunctions = {
  'intro-organogram': {
    'init': function() {
      pt.organogramIntro.init(graph);
    }
  },
  'org-tree-network': {
    'init': function() {
      pt.orgTreeNetwork.init(graph);
    },
    '-1': function() {
      pt.orgTreeNetwork.treeNetwork();
    },
    0: function() {
      pt.orgTreeNetwork.normalNetwork();
    }
  },
};

function removeSVGs() {

  //Remove (heavy) all existing svg currently running

  //Organogram
  d3.select('#intro-organogram #organogramIntro svg').remove();
  d3.select('#org-tree-network #orgTreeNetwork svg').remove();

}//removeSVGs
