require("./env");

var vows = require('vows');
var assert = require('assert');

var suite = vows.describe('Core');

suite.addBatch({
    'dc.version': {
        topic: function () {
            return dc.version
        },

        'has the form major.minor.patch': function (version) {
            assert.match(version, /^[0-9]+\.[0-9]+\.[0-9]+$/);
        }
    },
    'dc.charts': {
        topic: function() {
            var chart = dc.pieChart("#id");
            sinon.spy(chart, "filterAll");
            sinon.spy(chart, "render");
            return chart;
        },
        'should register chart object': function(chart) {
            assert.isTrue(dc.hasChart(chart));
        },
        'filterAll should invoke filter on each chart': function(chart) {
            dc.filterAll();
            assert.isTrue(chart.filterAll.calledOnce);
        },
        'renderAll should invoke filter on each chart': function(chart) {
            dc.renderAll();
            assert.isTrue(chart.render.calledOnce);
        },
        'should be gone after remove all': function(chart) {
            dc.deregisterAllCharts();
            assert.isFalse(dc.hasChart(chart));
        },
        teardown: function() {
            dc.deregisterAllCharts();
        }
    },
    'dc.transition': {
        topic: function() {
            var selections = {
                transition:function() {
                    return selections;
                },
                duration:function() {
                    return selections;
                }
            };
            sinon.spy(selections, "transition");
            sinon.spy(selections, "duration");
            return selections;
        },
        'normal': {
            'transition should be activated with duration': function(selections) {
                dc.transition(selections, {transitionDuration: function() {
                    return 100;
                }});
                assert.isTrue(selections.transition.calledOnce);
                assert.isTrue(selections.duration.calledOnce);
            },
            teardown: function(selections) {
                selections.transition.restore();
                selections.duration.restore();
            }
        },

        'normal': {
            'transition should not be activated with 0 duration': function(selections) {
                dc.transition(selections, {transitionDuration: function() {
                    return 0;
                }});
                assert.isFalse(selections.transition.called);
                assert.isFalse(selections.duration.called);
            },
            teardown: function(selections) {
                selections.transition.restore();
                selections.duration.restore();
            }
        }
    }
});

suite.export(module);


