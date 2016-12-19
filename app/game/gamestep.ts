import {Word} from "../entities/word";

export class GameStep {
    word: Word;
    letters: string;
    deletedLettersCount: number;
    done: boolean;
    score: number;
    maxScore: number;

    constructor(word: Word) {
        this.done = false;
        this.word = word;
        this.deletedLettersCount = 0;
        this.letters = this.word.mangled.split('').join(', ');
        this.score = 0;
        this.maxScore = Math.floor(Math.pow(1.95, (this.word.mangled.length / 3.0)));
    }
}