import './wordgame.scss';

import {BaseComponent} from "../../common/component";
import {BindingType} from '../../common/bindingTypes';
import {WordsFeedService} from "../../services/words-feed-service";
import {Word} from "../../services/words-feed-service";

interface WordGameItem {
    href: string,
    label: string
}

class WordGameController {
    wordsFeedService: WordsFeedService;
    word: Word;

    static $inject = ['$scope', 'wordsFeedService'];

    constructor($scope: ng.IScope, wordsFeedService: WordsFeedService) {
        wordsFeedService.getWord().then((response: ng.IHttpPromiseCallbackArg<Word>) => {
            this.word = response.data;
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
