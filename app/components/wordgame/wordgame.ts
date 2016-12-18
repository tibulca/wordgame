import './wordgame.scss';

import {BaseComponent} from "../../common/component";
import {BindingType} from '../../common/bindingTypes';
import {WordsFeedMockService} from "../../services/words-feed-service";
import {Word} from "../../services/words-feed-service";

class GameStep {
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

class Game {
    public currentStep: GameStep;
    public isInProgress: boolean;

    private steps: GameStep[];
    private totalScore: number;
    private remainingTime: number;
    private previousInputWord: string;

    constructor(private $timeout: ng.ITimeoutService, 
                private wordsFeedService: WordsFeedMockService) {
        this.wordsFeedService = wordsFeedService;
        this.steps = [];
        this.totalScore = 0;
        this.isInProgress = false;
        this.remainingTime = 40;
        this.previousInputWord = '';
    }

    public start() {
        this.getNextWord();
        this.isInProgress = true;
        this.totalScore = 0;
        this.remainingTime = 41;
        this.run();
    }

    public checkWord(text: string): boolean {
        if (!this.isInProgress || this.currentStep.done) {
            return false;
        }

        this.checkForMistakes(text);

        if (this.currentStep.word.unmangled.toLowerCase() === text.toLowerCase()) {
            this.finalizeCurrentStep();
            this.getNextWord();
            return true;
        }

        return false;
    }

    private checkForMistakes(text: string) {
        if (this.previousInputWord.length > text.length) {
            this.currentStep.deletedLettersCount += this.previousInputWord.length - text.length
        }
        this.previousInputWord = text;
    }

    public getTotalScore(): number {
        return this.totalScore;
    }

    public getRemainingTime(): number {
        return this.remainingTime;
    }

    public getCurrentStepMaxScore(): number {
        return this.currentStep ? this.currentStep.maxScore : 0;
    }

    public getCurrentStepScore(): number {
        return this.currentStep ? this.currentStep.score : 0;
    }

    public getWordLetters(): string {
        return this.currentStep ? this.currentStep.letters : undefined;
    }

    private run() {
        if (!this.isInProgress) {
            return;
        }

        this.remainingTime--;
        if (this.remainingTime === 0) {
            this.isInProgress = false;
            return;
        }

        this.$timeout(1000).then(() => this.run());
    }

    private addStep(word: Word) {
        this.currentStep = new GameStep(word);
        this.steps.push(this.currentStep);
    }

    private finalizeCurrentStep() {
        this.currentStep.score = this.calculateScore(this.currentStep);
        this.currentStep.done = true;
        this.previousInputWord = '';

        this.totalScore += this.currentStep.score;
    }

    private calculateScore(step: GameStep): number {
        const stepScore = this.currentStep.maxScore - this.currentStep.deletedLettersCount;
        return stepScore > 0 ? stepScore : 0;
    }
    
    private getNextWord() {
        this.wordsFeedService.getNextWord().then((response: ng.IHttpPromiseCallbackArg<Word>) => {
            this.addStep(response.data)
        });
    }
}

class WordGameController {
    public inputText: string;
    public wordMatch: boolean;
    private game: Game;

    static $inject = ['$scope', '$timeout', 'wordsFeedService'];

    constructor($scope: ng.IScope, 
                private $timeout: ng.ITimeoutService, 
                private wordsFeedService: WordsFeedMockService) {
        this.inputText = '';
        this.wordMatch = false;
    }

    public startGame() {

        this.game = new Game(this.$timeout, this.wordsFeedService);
        this.game.start();
    }

    public inputChanged() {
        const inputMatchesWord = this.game.checkWord(this.inputText);
        if (inputMatchesWord) {
            this.animateScore();
        }
    }

    private animateScore() {
        this.wordMatch = true;
        this.$timeout(1000).then(() => { 
            this.wordMatch = false;
            this.inputText = '';
        });
    }
}

class WordGame extends BaseComponent {
    public scope = { name: BindingType.ONE_WAY };
    public controllerAs = 'ctrl';
    public controller = WordGameController;
    public template = require('./wordgame.html');
}

angular.module('app')
       .directive('wordgame', () => new WordGame());
