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

class HokmGame {
    constructor(mode = 4) {
        this.mode = mode; // 2 یا 4 نفره
        this.deck = new Deck();
        this.deck.shuffle();
        this.players = mode === 4 ? [[], [], [], []] : [[], []];
        this.trump = null;
        this.gamePhase = 'DEALING_FIRST_5'; // مراحل بازی
        this.scores = { team1: 0, team2: 0 };
    }

    // مرحله اول: توزیع ۵ کارت اول به هر بازیکن
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

    // مرحله دوم: انتخاب حکم توسط حاکم و پخش بقیه کارت‌ها
    setTrumpAndDealRest(suit) {
        this.trump = suit;
        this.gamePhase = 'DEALING_REST';

        // توزیع باقی‌مانده کارت‌ها بر اساس قوانین حکم (ابتدا ۴ کارت برای حاکم یا تکمیل دست‌ها)
        while (this.deck.cards.length > 0) {
            for (let p = 0; p < this.players.length; p++) {
                if (this.deck.cards.length > 0) {
                    this.players[p].push(this.deck.cards.pop());
                }
            }
        }
        this.gamePhase = 'PLAYING';
    }

    // بررسی قوانین بازی (پیروی از خال و بریدن)
    validateMove(playerHand, playedCard, leadSuit) {
        if (!leadSuit) return true; // اولین کارت دست است
        if (playedCard.suit === leadSuit) return true; // همرنگ است
        
        // آیا بازیکن از خالِ سر دسته کارت دارد؟
        const hasLeadSuit = playerHand.some(c => c.suit === leadSuit);
        if (!hasLeadSuit) {
            return true; // اگر ندارد، می‌تواند ببرد (حکم یا خال دیگر)
        }
        
        return false; // خطا: بازیکن خالِ همرنگ دارد ولی کارت دیگری بازی کرده است
    }
}
