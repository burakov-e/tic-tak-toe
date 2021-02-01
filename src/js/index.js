'use strict';

const field = document.querySelector('.field');
const FIELD = [ [-1, -1, -1],
                [-1, -1, -1],
                [-1, -1, -1] ];

let isTic = true;

// const player1 = {
//     human: true,
//     figure: 1,
//     className: 'field__cell_tic',
//     currentStep: true
// }
//
// const player2 = {
//     human: false,
//     figure: 0,
//     className: 'field__cell_toe',
//     currentStep: false
// }
//
function checkField() {
    let rows = [ new Set(FIELD[0]), new Set(FIELD[1]), new Set(FIELD[2]) ].reduce((acc, set, index) => {
        if (set.size === 1 && !set.has(-1)) {
            acc.push(index);
        }
        return acc;
    }, []);
    if (rows.length) {
        console.log('rows', rows);
        return {
            win: true,
            coords: [ { x: rows[0], y: 0 },{ x: rows[0], y: 1 }, { x: rows[0], y: 2 } ]
        };
    }

    let columns = [];
    for (let i = 0; i < 3; i++) {
        let container = new Set();
        for (let j = 0; j < 3; j++) {
            container.add(FIELD[j][i]);
        }
        columns.push(container);
    }
    columns = columns.reduce((acc, set, index) => {
        if (set.size === 1 && !set.has(-1)) {
            acc.push(index);
        }
        return acc;
    }, []);
    if (columns.length) {
        console.log('col', columns)
        return {
            win: true,
            coords: [ { x: 0, y: columns[0] },{ x: 1, y: columns[0] }, { x: 2, y: columns[0] } ]
        };
    }

    let diagonals = [ new Set([ FIELD[0][0], FIELD[1][1], FIELD[2][2] ]),
                      new Set([ FIELD[0][2], FIELD[1][1], FIELD[2][0] ]) ];
    diagonals = diagonals.reduce((acc, set, index) => {
        if (set.size === 1 && !set.has(-1)) {
            acc.push(index);
        }
        return acc;
    }, []);

    if (diagonals.length) {
        console.log('dig', diagonals);
        return {
            win: true,
            coords: diagonals[0] === 0 ? [ { x: 0, y: 0 },{ x: 1, y: 1 }, { x: 2, y: 2 } ] : [ { x: 0, y: 2 },{ x: 1, y: 1 }, { x: 2, y: 0 } ]
        };
    }

    return {
        win: false
    }
}

function setFigure(node, figure) {
    node.classList.add(`field__cell_${figure}`);
    node.classList.remove('field__cell_active');
}

function play(event) {
    const cell = event.target.closest('.field__cell');

    if (!cell || !field.contains(cell)) {
        return;
    }

    let [x, y] = [cell.dataset.x, cell.dataset.y];

    if (FIELD[x][y] !== -1) {
        return;
    }

    if (isTic) {
        setFigure(cell, 'tic');
        FIELD[x][y] = 1;
    } else {
        setFigure(cell, 'toe');
        FIELD[x][y] = 0;
    }

    let isWin = checkField();
    if (isWin.win) {
        isWin.coords.forEach(cellCoord => {
            field.querySelector(`.field__cell[data-x="${cellCoord.x}"][data-y="${cellCoord.y}"]`).classList.add('field__cell_win')
        });
        field.removeEventListener('click', play);

        if (isTic) {
            console.log('X');
        } else {
            console.log('O');
        }
        return;
    }

    isTic = !isTic;
    console.log('-------', FIELD);
}

field.addEventListener('click', play);