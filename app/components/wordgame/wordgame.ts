import './wordgame.scss';

import {BaseComponent} from "../../common/component";
import {BindingType} from '../../common/bindingTypes';
import {WordsFeedMockService} from "../../services/wordsfeedservice";
import {Word} from "../../entities/word";
import {Game} from "../../game/game";

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
