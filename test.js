'use strict';

var Table = require('./Table');
var test = require('tape');

var DEFAULT_TABLE = {
    headers: ['one', 'two'],
    info: 'Some description',
    notes: {
        '3': 'Note for row four'
    },
    rows: [[1, 2], [3, 4], [5, 6], [7, 8]]
};

var five = [-7, 5, 30.1, 6, -99];
var ten = [-1, 0, 1, 5, 6, 8, 9, 2, 44, 6.6];
var zeroGaps = [0, 0, 2, 3, 0, 0, 6, 7, 8, 0, 10, 0, 12, 0];

test('new Table(headers)', function (t) {
    t.plan(2);
    var headers = ['one', 'two', 'three'];
    var tbl = new Table(headers);
    t.deepEqual(tbl.getColumn('one'), [], 'Get column');
    t.equal(tbl.getColumn('none'), null, 'Get null as incorrect column');
    t.end();
});

test('Table.addColumn()', function (t) {
    t.plan(2);
    var tbl = new Table(DEFAULT_TABLE);
    tbl.addColumn('three', 2);
    t.deepEqual(tbl.getColumn('one'), [1, 3, 5, 7], 'Old data is fine');
    t.deepEqual(tbl.getColumn('three'), [2, 2, 2, 2], 'New data is fine');
    t.end();
});

test('Table.offset()', function (t) {
    t.plan(10);
    var headers = ['one'];
    var tbl = new Table(headers);
    ten.forEach(function (val) {
        tbl.addRow([val]);
    });
    const OFFSET = 4;
    const ANSWER = [NaN, NaN, NaN, NaN, -1, 0, 1, 5, 6, 8];
    tbl.offset('one', OFFSET);
    tbl.getColumn('one').forEach((value, rowId) => {
        if (rowId < OFFSET) {
            t.true(isNaN(value), 'Expected NaN: ' + rowId);
        } else {
            t.equal(value, ANSWER[rowId], 'Value correct: ' + rowId);
        }
    });
    t.end();
});

test('Table.interpolateOverZeros()', function (t) {
    t.plan(zeroGaps.length);
    var headers = ['one'];
    var tbl = new Table(headers);
    zeroGaps.forEach(function (val) {
        tbl.addRow([val]);
    });
    const ANSWER = [0, 0, 2, 3, 3, 3, 6, 7, 8, 8, 10, 10, 12, 12];
    tbl.smooth('one');
    tbl.getColumn('one').forEach((value, rowId) => {
        t.equal(value, ANSWER[rowId], 'Value correct: ' + rowId);
    });
    t.end();
});

test('Table.smooth()', function (t) {
    t.plan(zeroGaps.length);
    var headers = ['one'];
    var tbl = new Table(headers);
    zeroGaps.forEach(function (val) {
        tbl.addRow([val]);
    });
    const ANSWER = [0, 0, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 0];
    tbl.interpolateOverZeros('one');
    tbl.getColumn('one').forEach((value, rowId) => {
        t.equal(value, ANSWER[rowId], 'Value correct: ' + rowId);
    });
    t.end();
});


test('Table.unwrapDegrees()', function (t) {

    const wrappedDegrees = [ 178, 179, -180, -179, -178, -135, -70, -30, 0, 60, 120, 179, 180, -179, -171];
    const upwrappedDegrees = [ 178, 179, 180, 181, 182, 225, 290, 330, 360, 420, 480, 539, 540, 541, 549];

    t.plan(wrappedDegrees.length);

    var headers = ['one'];
    var tbl = new Table(headers);
    wrappedDegrees.forEach(function (val) {
        tbl.addRow([val]);
    });
    tbl.unwrapDegrees('one');
    tbl.getColumn('one').forEach((value, rowId) => {
        t.equal(value, upwrappedDegrees[rowId], 'Value correct: ' + rowId);
    });
    t.end();
});
