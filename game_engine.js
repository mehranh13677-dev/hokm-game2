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
        this.gamePhase = 'DEALING_FIRST_5'; // مراحل: DEALING_FIRST_5, SELECTING_TRUMP, DEALING_REST, PLAYING
    }

    // پخش ۵ کارت اول برای تعیین حاکم و حکم
    startInitialDeal() {
        this.deck = new Deck();
        this.deck.shuffle();
        this.players = this.mode === 4 ? [[], [], [], []] : [[], []];
        
        for (let i = 0; i < 5; i++) {
            for (let p = 0; p < this.players.length; p++) {
                this.players[p].push(this.deck.cards.pop());
            }
        }
        this.gamePhase = 'SELECTING_TRUMP';
    }

    // انتخاب حکم توسط حاکم
    setTrump(suit) {
        this.trump = suit;
        this.gamePhase = 'DEALING_REST';
        this.distributeRemainingCards();
    }

    // پخش بقیه کارت‌ها پس از انتخاب حکم
    distributeRemainingCards() {
        // در حکم سنتی، پس از ۵ کارت، بقیه کارت‌ها توزیع می‌شوند
        while (this.deck.cards.length > 0) {
            for (let p = 0; p < this.players.length; p++) {
                if (this.deck.cards.length > 0) {
                    this.players[p].push(this.deck.cards.pop());
                }
            }
        }
        this.gamePhase = 'PLAYING';
    }
}
