class Card {
    constructor(suit, rank) {
        this.suit = suit; // '♠', '♥', '♦', '♣'
        this.rank = rank; // 2-14 (11=J, 12=Q, 13=K, 14=A)
    }

    getRankName() {
        const names = { 14: 'آس', 13: 'شاه', 12: 'بی‌بی', 11: 'سرباز' };
        return names[this.rank] || this.rank;
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

class HokmGameEngine {
    constructor(mode = 4) {
        this.mode = mode; // 2 یا 4 نفره
        this.deck = new Deck();
        this.players = Array.from({ length: mode }, () => []);
        this.trump = null;
        this.turn = 0; // 0: بازیکن، بقیه هوش مصنوعی
        this.leadSuit = null;
        this.currentTrick = []; // کارت‌های بازی شده روی میز
        this.scores = { us: 0, rival: 0 };
        this.trickScores = { us: 0, rival: 0 };
        this.gamePhase = 'LOBBY';
    }

    startNewGame() {
        this.deck = new Deck();
        this.deck.shuffle();
        this.players = Array.from({ length: this.mode }, () => []);
        this.trump = null;
        this.leadSuit = null;
        this.currentTrick = [];
        this.trickScores = { us: 0, rival: 0 };
        
        // توزیع ۵ کارت اول
        for (let i = 0; i < 5; i++) {
            for (let p = 0; p < this.players.length; p++) {
                this.players[p].push(this.deck.cards.pop());
            }
        }
        this.gamePhase = 'SELECTING_TRUMP';
    }

    setTrump(suit) {
        this.trump = suit;
        // توزیع مابقی کارت‌ها (بقیه ۱۳ کارت کامل شود)
        while (this.deck.cards.length > 0) {
            for (let p = 0; p < this.players.length; p++) {
                if (this.deck.cards.length > 0) {
                    this.players[p].push(this.deck.cards.pop());
                }
            }
        }
        this.gamePhase = 'PLAYING';
    }

    // هوش مصنوعی ساده برای انتخاب کارت توسط حریفان
    aiPlayCard(playerIndex) {
        const hand = this.players[playerIndex];
        if (hand.length === 0) return null;

        // اگر حریف باید کارت اول را بازی کند
        if (!this.leadSuit) {
            const card = hand.pop();
            this.leadSuit = card.suit;
            return card;
        }

        // بررسی قانون همرنگی
        const matchingCards = hand.filter(c => c.suit === this.leadSuit);
        if (matchingCards.length > 0) {
            const card = matchingCards.pop();
            // حذف از دست بازیکن
            const idx = hand.indexOf(card);
            hand.splice(idx, 1);
            return card;
        } else {
            // اگر ندارد، هر کارتی (یا حکم) می‌تواند بازی کند
            const card = hand.pop();
            return card;
        }
    }

    // بررسی برنده دست (Trick)
    evaluateTrick() {
        let winningCard = this.currentTrick[0];
        let winnerIndex = winningCard.playerIndex;

        for (let i = 1; i < this.currentTrick.length; i++) {
            const c = this.currentTrick[i];
            // قوانین مقایسه کارت: حکم برنده است، یا همرنگ با رتبه بالاتر
            if (c.card.suit === this.trump && winningCard.card.suit !== this.trump) {
                winningCard = c;
                winnerIndex = c.playerIndex;
            } else if (c.card.suit === winningCard.card.suit && c.card.rank > winningCard.card.rank) {
                winningCard = c;
                winnerIndex = c.playerIndex;
            }
        }

        // ثبت امتیاز دست (در حالت ۴ نفره: تیم 0 و 2 در برابر 1 و 3)
        if (this.mode === 4) {
            if (winnerIndex === 0 || winnerIndex === 2) {
                this.trickScores.us++;
            } else {
                this.trickScores.rival++;
            }
        } else {
            if (winnerIndex === 0) {
                this.trickScores.us++;
            } else {
                this.trickScores.rival++;
            }
        }

        this.currentTrick = [];
        this.leadSuit = null;
        return winnerIndex;
    }
}
