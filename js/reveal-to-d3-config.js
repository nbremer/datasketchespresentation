/* global d3 */

var pt = pt || {};

pt.slideIdToFunctions = {
  'datasketches-title': {
    'init': function() {
      pt.datasketchesTitle.init();
    }
  },
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
  'royal-network': {
    'init': function() {
      pt.royalNetwork.init(royalNetworkNodes, royalNetworkLinks);
    },
    '-1': function() {
      pt.royalNetwork.chaos(royalNetworkNodes, royalNetworkLinks);
    },
    0: function() {
      pt.royalNetwork.hairball(royalNetworkNodes, royalNetworkLinks);
    },
    1: function() {
      pt.royalNetwork.colorBirthYear();
    },
    2: function() {
      pt.royalNetwork.stretchX(royalNetworkNodes, royalNetworkLinks);
    },
    3: function() {
      pt.royalNetwork.stretchY(royalNetworkNodes, royalNetworkLinks);
    },
    4: function() {
      pt.royalNetwork.updateDesign(royalNetworkNodes, royalNetworkLinks);
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
  // 'dbz-path-simple': {
  //   'init': function() {
  //     pt.dbzPathSimple.init(dbzFights);
  //   },
  //   '-1': function() {
  //     pt.dbzPathSimple.showCirclesOnly();
  //   },
  //   0: function() {
  //     pt.dbzPathSimple.showSimplePaths();
  //   },
  //   1: function() {
  //     pt.dbzPathSimple.showAnchorPoints();
  //   },
  //   2: function() {
  //     pt.dbzPathSimple.addSwoop();
  //   },
  //   3: function() {
  //     pt.dbzPathSimple.addChangeSide();
  //   },
  //   4: function() {
  //     pt.dbzPathSimple.hideAnchors();
  //   },
  // },
  // 'dbz-path-final': {
  //   'init': function() {
  //     pt.dbzPathFinal.init(dbzFights);
  //   }
  // },
  // 'in-english-network-bad': {
  //   'init': function() {
  //     pt.inEnglishNetwork.init(networkLinks, false, "in-english-network-bad", "inEnglishNetworkBad");
  //   }
  // },
  // 'in-english-network-good': {
  //   'init': function() {
  //     pt.inEnglishNetwork.init(networkLinks, true, "in-english-network-good", "inEnglishNetworkGood");
  //   }
  // },
  'olympic-buildup': {
    'init': function() {
      pt.olympicBuildUp.init(olympicData);
    },
    '-1': function() {
      pt.olympicBuildUp.initializeCircles();
    },
    0: function() {
      pt.olympicBuildUp.rotateCircles();
    },
    1: function() {
      pt.olympicBuildUp.rotateFeathers();
    },
    2: function() {
      pt.olympicBuildUp.outwardEditions();
    },
    3: function() {
      pt.olympicBuildUp.outwardMedals();
    },
  },
  'magic-legend': {
    'init': function() {
      pt.magicLegend.init();
    }
  },
  'end-slide': {
    'init': function() {
      pt.endSlide.init();
    }
  },
  // Shirley slides
  'sketch-lines': {
    init: () => {
      pt.sketchLines.init();
    },
    '-1': () => {
      // all the lines positioned by character, and also their names
      var animateBefore = true;
      var triggerForce = true;
      pt.sketchLines.drawLines(hamiltonAllLines, animateBefore, triggerForce);
      pt.sketchLines.drawSongs(hamiltonCharacters, 'middle');
      pt.sketchLines.drawStaffs([]);
      pt.sketchLines.drawCurves([]);
      pt.sketchLines.drawThemes([]);
    },
    0: () => {
      // lines grouped consecutively
      // positioned by character, and also their names
      var animateBefore = true;
      var triggerForce = true;
      pt.sketchLines.drawLines(hamiltonGroupedLines, animateBefore, triggerForce);
      pt.sketchLines.drawSongs(hamiltonCharacters, 'middle');
      pt.sketchLines.drawStaffs([]);
      pt.sketchLines.drawCurves([]);
      pt.sketchLines.drawThemes([]);
    },
    1: () => {
      // fade in sketch notes, do no animating
      var animateBefore = false;
      var triggerForce = true;
      pt.sketchLines.drawLines(hamiltonGroupedLines, animateBefore, triggerForce);
      pt.sketchLines.drawSongs(hamiltonCharacters, 'middle');
      pt.sketchLines.drawStaffs([]);
      pt.sketchLines.drawCurves([]);
      pt.sketchLines.drawThemes([]);
      // so lower opacity of everything
      pt.sketchLines.lowerOpacity();
    },
    2: () => {
      pt.sketchLines.drawSongs([], 'start');
      pt.sketchLines.drawStaffs([]);
      pt.sketchLines.drawCurves([]);
      pt.sketchLines.drawThemes([]);

      var animateBefore = false;
      var triggerForce = true;
      // fade out sketch notes and first try at rectangular lines
      // don't animate path before re-positioning
      pt.sketchLines.drawLines(hamiltonLines, animateBefore, triggerForce, () => {
        pt.sketchLines.drawSongs(hamiltonSongs, 'start');
      });
    },
    3: () => {
      // add in diamond theme, but nothing else should animate
      var animateBefore = false;
      var triggerForce = false;
      pt.sketchLines.drawLines(hamiltonLines, animateBefore, triggerForce)
      pt.sketchLines.drawSongs(hamiltonSongs, 'start');
      pt.sketchLines.drawStaffs([]);
      pt.sketchLines.drawCurves([]);
      pt.sketchLines.drawThemes(hamiltonThemes);
    },
    4: () => {
      // fade in second sketch note, do no animating
      var animateBefore = false;
      var triggerForce = true;
      pt.sketchLines.drawLines(hamiltonLines, animateBefore, triggerForce)
      pt.sketchLines.drawSongs(hamiltonSongs, 'start');
      pt.sketchLines.drawStaffs([]);
      pt.sketchLines.drawCurves([]);
      pt.sketchLines.drawThemes(hamiltonThemes);
      pt.sketchLines.lowerOpacity();
    },
    5: () => {
      pt.sketchLines.drawSongs([], 'start');
      pt.sketchLines.drawThemes([]);

      // fade out sketch notes, animate in final lines and background staff and themes
      var animateBefore = false;
      var triggerForce = true;
      pt.sketchLines.drawLines(hamiltonFinalLines, animateBefore, triggerForce, () => {
        pt.sketchLines.drawSongs(hamiltonFinalSongs, 'start');
        pt.sketchLines.drawStaffs(hamiltonFinalSongs);
        pt.sketchLines.drawCurves(hamiltonFinalThemes);
      });
    },
    6: () => {
      // take away staff finally
      var animateBefore = false;
      var triggerForce = false;
      pt.sketchLines.drawLines(hamiltonFinalLines, animateBefore, triggerForce);
      pt.sketchLines.drawSongs(hamiltonFinalSongs, 'start');
      pt.sketchLines.drawCurves(hamiltonFinalThemes);
      pt.sketchLines.drawStaffs([]);
    },
  }
};

function removeSVGs() {

  //Remove (heavy) all existing svg currently running

  //Intro
  clearInterval(pt.datasketchesTitle.loop);

  //data - nadieh
  d3.select('#olympic-intro #olympicIntro svg').remove();
  d3.select('#olympic-buildup #olympicBuildUp svg').remove();

  //sketch - nadieh
  d3.select('#royal-network #royalNetwork svg').remove();

  //code - nadieh
  d3.select('#lotr-intro #lotrIntro svg').remove();
  //d3.select('#chord-to-loom-1 #chordToLoom svg').remove();
  //d3.select('#chord-to-loom-2 #chordToLoom2 svg').remove();

  //End
  clearInterval(pt.endSlide.loop);

}//removeSVGs
