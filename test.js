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
    for (var i = 0; i < 10; i += 1) {
        tbl.addRow([ten[i]]);
    }
    const OFFSET = 4;
    const ANSWER = [NaN, NaN, NaN, NaN, -1, 0, 1, 5, 6, 8];
    tbl.offset('one', OFFSET);
    tbl.getColumn('one').forEach((value, rowId) => {
        if (rowId < OFFSET) {
            t.true(isNaN(value), 'Expected NaN: ' + rowId);
        } else {
            t.equal(ANSWER[rowId], value, 'Value correct: ' + rowId);
        }
    });
    t.end();
});
