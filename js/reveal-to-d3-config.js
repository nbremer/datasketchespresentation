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
  'lotr-intro': {
    'init': function() {
      pt.lotrIntro.init(lotrWords);
    }
  },
  'chord-to-loom-1': {
    'init': function() {
      pt.chordToLoom.init();
    },
    '-1': function() {
      pt.chordToLoom.normalChord();
    },
    0: function() {
      pt.chordToLoom.adjustedChord();
    },
    1: function() {
      pt.chordToLoom.adjustedArc();
    }
  },
  'chord-to-loom-2': {
    'init': function() {
      pt.chordToLoom2.init(lotrWords);
    },
    '-1': function() {
      pt.chordToLoom2.adjustedData();
    },
    0: function() {
      pt.chordToLoom2.adjustedColors(lotrWords);
    },
    1: function() {
      pt.chordToLoom2.innerLocation(lotrWords);
    },
    3: function() {
      pt.chordToLoom2.stringShape(lotrWords);
    },
    2: function() {
      pt.chordToLoom2.moveApart(lotrWords);
    },
  },
  'dbz-path-simple': {
    'init': function() {
      pt.dbzPathSimple.init(dbzFights);
    },
    '-1': function() {
      pt.dbzPathSimple.showCirclesOnly();
    },
    0: function() {
      pt.dbzPathSimple.showSimplePaths();
    },
    1: function() {
      pt.dbzPathSimple.showAnchorPoints();
    },
    2: function() {
      pt.dbzPathSimple.addSwoop();
    },
    3: function() {
      pt.dbzPathSimple.addChangeSide();
    },
    4: function() {
      pt.dbzPathSimple.hideAnchors();
    },
  },
  'dbz-path-final': {
    'init': function() {
      pt.dbzPathFinal.init(dbzFights);
    }
  },
  'in-english-network': {
    'init': function() {
      pt.inEnglishNetwork.init(networkLinks);
    },
    '-1': function() {
      pt.inEnglishNetwork.doBadSwitch();
    },
    0: function() {
      pt.inEnglishNetwork.doGoodSwitch();
    },
  },
};

function removeSVGs() {

  //Remove (heavy) all existing svg currently running

  d3.select('#olympic-intro #olympicIntro svg').remove();
  d3.select('#olympic-buildup #olympicBuildUp svg').remove();

}//removeSVGs
