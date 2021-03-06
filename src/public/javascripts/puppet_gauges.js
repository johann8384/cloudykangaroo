/* jshint undef: true, devel: true, unused: true, browser: true, node: false */
/*global $:false */
/*global JustGage:false */
var successGauge, failuresGauge, skipsGauge;
// var noopsGague, totalGauge;
var numNodes, numResources, resourceDupes, resourcesPerNode;

var refreshGauges = function()
{
  "use strict";
  $.getJSON('/api/v1/puppet/metrics/population', function (data) {
    $.each(data, function(key, val) {
      switch (key.toLowerCase()) {
        case 'numnodes':
          numNodes.refresh(Math.round(val));
          break;
        case 'numresources':
          numResources.refresh(Math.round(val/1000));
          break;
        case 'resourcedupes':
          resourceDupes.refresh(Math.round(val*100));
          break;
        case 'resourcespernode':
          resourcesPerNode.refresh(Math.round(val));
          break;
      }
    });
  });

  $.getJSON('/api/v1/puppet/aggregate_event_counts/hours/4', function (data) {
    $.each(data, function(key, val) {
      switch (key.toLowerCase()) {
        case 'successes':
          successGauge.refresh(Math.round((val/data.total)*100));
          break;
        case 'failures':
          failuresGauge.refresh(Math.round((val/data.total)*100));
          break;
        case 'noops':
          //noopsGauge.refresh(Math.round((val/data.total)*100));
          break;
        case 'skips':
          skipsGauge.refresh(Math.round((val/data.total)*100));
          break;
        case 'total':
          //totalGauge.refresh(Math.round(val));
          $('#totalGauge').children('h2').text(val);
          break;
      }
    });
  });
};

window.onload = function(){
  "use strict";
  numNodes = new JustGage({
    id: "numNodes",
    value: 0,
    min: 0,
    max: 1000,
    levelColors: ['#00FF00','#00FF00','#00FF00'],
    title: "Nodes",
    label: "#"
  });
  numResources = new JustGage({
    id: "numResources",
    value: 0,
    min: 0,
    max: 100,
    levelColors: ['#00FF00','#00FF00','#00FF00'],
    title: "Resources",
    label: "#k"
  });
  resourceDupes = new JustGage({
    id: "resourceDupes",
    value: 0,
    min: 0,
    max: 100,
    levelColors: ['#FF0000','#FFFF00','#00FF00'],
    title: "Duplicate Resources",
    label: "%"
  });
  resourcesPerNode = new JustGage({
    id: "resourcesPerNode",
    value: 0,
    min: 0,
    max: 100,
    levelColors: ['#00FF00','#00FF00','#00FF00'],
    title: "Resources Per Node",
    label: "Avg"
  });
  successGauge = new JustGage({
    id: "successGauge",
    value: 0,
    min: 0,
    max: 100,
    levelColors: ['#FF0000','#FFFF00','#00FF00'],
    title: "Succeeded",
    label: "%"
  });
  failuresGauge = new JustGage({
    id: "failuresGauge",
    value: 0,
    min: 0,
    max: 100,
    title: "Failed",
    label: "%"
  });
  /*noopsGauge = new JustGage({
    id: "noopsGauge",
    value: 0,
    min: 0,
    max: 100,
    title: "NoOps",
    label: "%"
  });*/
  skipsGauge = new JustGage({
    id: "skipsGauge",
    value: 0,
    min: 0,
    max: 100,
    title: "Skipped",
    label: "%"
  });
  /*totalGauge = new JustGage({
    id: "totalGauge",
    value: 0,
    min: 0,
    max: 1000,
    title: "Total",
    label: "Reports"
  }); */
  refreshGauges();
  setInterval(function() {
    refreshGauges();
  }, 60 * 2 * 1000);
};