class Card {
    constructor(suit, rank) {
        this.suit = suit; // '♠', '♥', '♦', '♣'
        this.rank = rank; // 2-14 (11=J, 12=Q, 13=K, 14=A)
    }

    getRankName() {
        if (this.rank === 14) return 'آس';
        if (this.rank === 13) return 'شاه';
        if (this.rank === 12) return 'بی‌بی';
        if (this.rank === 11) return 'سرباز';
        return this.rank;
    }

    isRed() {
        return this.suit === '♥' || this.suit === '♦';
    }
}

class Deck {
    constructor() {
        this.cards = [];
        const suits = ['♠', '♥', '♦', '♣'];
        for (let s of suits) {
            for (let r = 2; r <= 14; r++) {
                this.cards.push(new Card(s, r));
            }
        }
    }

    shuffle() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }
}

class HokmGame {
    constructor(mode = 4) {
        this.mode = mode; // 2 یا 4 نفره
        this.deck = new Deck();
        this.deck.shuffle();
        this.players = mode === 4 ? [[], [], [], []] : [[], []];
        this.trump = null;
    }

    // پخش ۵ کارت اول برای تعیین حاکم و حکم
    startInitialDeal() {
        for (let i = 0; i < 5; i++) {
            for (let p = 0; p < this.players.length; p++) {
                this.players[p].push(this.deck.cards.pop());
            }
        }
        this.renderPlayerHand();
        document.getElementById('game-status').innerText = "۵ کارت اول توزیع شد. حاکم باید حکم را مشخص کند.";
    }

    renderPlayerHand() {
        const handContainer = document.getElementById('player-cards');
        handContainer.innerHTML = '';
        // بازیکن شماره صفر (کاربر اصلی)
        this.players[0].forEach(card => {
            const cardDiv = document.createElement('div');
            cardDiv.className = card.isRed() ? 'card red' : 'card';
            cardDiv.innerHTML = `<span>${card.getRankName()}</span><span>${card.suit}</span>`;
            handContainer.appendChild(cardDiv);
        });
    }
}
