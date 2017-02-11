/* global d3 */

var pt = pt || {};

pt.slideIdToFunctions = {
  'olympic-intro': {
    'init': function() {
      pt.olympicIntro.init(olympicData);
    },
    '-1': function() {
      pt.olympicIntro.smallStart();
    },
    0: function() {
      pt.olympicIntro.bigEnd();
    },
  },
  'olympic-buildup': {
    'init': function() {
      pt.olympicBuildUp.init(olympicData);
    },
    '-1': function() {
      pt.olympicBuildUp.initializeCircles();
    },
    0: function() {
      pt.olympicBuildUp.rotateFeathers();
    },
    1: function() {
      pt.olympicBuildUp.outwardEditions();
    },
    2: function() {
      pt.olympicBuildUp.outwardMedals();
    },
  },
};

function removeSVGs() {

  //Remove (heavy) all existing svg currently running

  d3.select('#olympic-intro #olympicIntro svg').remove();
  d3.select('#olympic-buildup #olympicBuildUp svg').remove();

}//removeSVGs
