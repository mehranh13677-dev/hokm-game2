let board = {};
function initBoard() {
    board = {};
    for(let i=0; i<24; i++) board[i] = {color: null, count: 0};
    board[0] = {color: 'B', count: 2};
    board[5] = {color: 'W', count: 5};
    board[7] = {color: 'W', count: 3};
    board[11] = {color: 'B', count: 5};
    board[12] = {color: 'W', count: 5};
    board[16] = {color: 'B', count: 3};
    board[18] = {color: 'B', count: 5};
    board[23] = {color: 'W', count: 2};
}

let bar = { W: 0, B: 0 };
let currentTurn = 'W';
let dice = [];
let selectedPoint = null;

function renderBoard() {
    for(let i=0; i<24; i++) {
        let pEl = document.querySelector(`[data-index="${i}"]`);
        if(!pEl) continue;
        pEl.innerHTML = '';
        let data = board[i];
        if(data && data.count > 0) {
            for(let j=0; j<data.count; j++) {
                let ch = document.createElement('div');
                ch.className = `checker ${data.color === 'W' ? 'white' : 'black'}`;
                if(pEl.classList.contains('top')) {
                    ch.style.top = (j * 15) + 'px';
                } else {
                    ch.style.bottom = (j * 15) + 'px';
                }
                pEl.appendChild(ch);
            }
        }
    }
    document.getElementById('bar-top').innerHTML = bar.B > 0 ? `<div class="checker black" style="position:relative;"></div><span style="font-size:10px">${bar.B}</span>` : '';
    document.getElementById('bar-bottom').innerHTML = bar.W > 0 ? `<div class="checker white" style="position:relative;"></div><span style="font-size:10px">${bar.W}</span>` : '';
}

function rollDice() {
    if(dice.length > 0) return;
    let d1 = Math.floor(Math.random() * 6) + 1;
    let d2 = Math.floor(Math.random() * 6) + 1;
    
    document.getElementById('dice1').innerText = d1;
    document.getElementById('dice2').innerText = d2;
    dice = (d1 === d2) ? [d1, d1, d1, d1] : [d1, d2];
    
    document.getElementById('status').innerText = `تاس: ${d1} و ${d2} - نوبت ${currentTurn === 'W' ? 'سفید (شما)' : 'سیاه (ربات)'}`;
    
    if(currentTurn === 'B') {
        setTimeout(botMove, 1000);
    }
}

document.querySelectorAll('.point').forEach(point => {
    point.addEventListener('click', function() {
        if(currentTurn !== 'W' || dice.length === 0) return;
        let index = parseInt(this.getAttribute('data-index'));

        if(selectedPoint === null) {
            if(board[index].color === 'W' && board[index].count > 0) {
                selectedPoint = index;
                this.style.background = '#f39c1266';
            }
        } else {
            let diff = selectedPoint - index;
            if(dice.includes(diff)) {
                if(board[index].color === null || board[index].color === 'W' || board[index].count === 1) {
                    board[selectedPoint].count--;
                    if(board[selectedPoint].count === 0) board[selectedPoint].color = null;

                    if(board[index].color === 'B') {
                        bar.B++;
                        board[index] = {color: 'W', count: 1};
                    } else {
                        if(!board[index].color) board[index].color = 'W';
                        board[index].count++;
                    }

                    dice.splice(dice.indexOf(diff), 1);
                    selectedPoint = null;
                    renderBoard();
                    checkTurn();
                }
            }
            document.querySelectorAll('.point').forEach(p => p.style.background = '');
            selectedPoint = null;
        }
    });
});

function checkTurn() {
    document.getElementById('dice1').innerText = dice[0] || '-';
    document.getElementById('dice2').innerText = dice[1] || '-';

    if(dice.length === 0) {
        currentTurn = (currentTurn === 'W') ? 'B' : 'W';
        document.getElementById('status').innerText = `نوبت بازیکن ${currentTurn === 'W' ? 'سفید' : 'سیاه'}`;
        if(currentTurn === 'B') {
            setTimeout(rollDice, 1000);
        }
    }
}

function botMove() {
    if(currentTurn !== 'B') return;
    document.getElementById('status').innerText = "ربات در حال حرکت...";

    setTimeout(() => {
        while(dice.length > 0) {
            let d = dice[0];
            let moved = false;
            let blackPoints = [];
            for(let i=0; i<24; i++) {
                if(board[i].color === 'B' && board[i].count > 0) blackPoints.push(i);
            }
            blackPoints.sort((a,b) => b - a);

            for(let src of blackPoints) {
                let target = src + d;
                if(target < 24) {
                    if(board[target].color === null || board[target].color === 'B' || board[target].count === 1) {
                        board[src].count--;
                        if(board[src].count === 0) board[src].color = null;

                        if(board[target].color === 'W') {
                            bar.W++;
                            board[target] = {color: 'B', count: 1};
                        } else {
                            board[target].color = 'B';
                            board[target].count++;
                        }
                        moved = true;
                        break;
                    }
                }
            }
            if(moved) dice.shift();
            else dice = [];
        }
        renderBoard();
        document.getElementById('dice1').innerText = '-';
        document.getElementById('dice2').innerText = '-';
        currentTurn = 'W';
        document.getElementById('status').innerText = "نوبت شماست - تاس بیندازید";
    }, 1200);
}

initBoard();
renderBoard();
