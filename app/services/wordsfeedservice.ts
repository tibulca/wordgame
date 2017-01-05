import {HttpService} from "../common/service";
import {IWordsFeedService} from "./iwordsfeedservice";
import {Word} from "../entities/word";
import {knuthShuffle} from "knuth-shuffle"

const testWords: string[] = [ 'pizza', 'milk', 'egg', 'pasta', 'soup', 'steak', 'salad'];

export class WordsFeedMockService extends HttpService
                              implements IWordsFeedService {
    private currentIndex: number;

    static $inject = ['$http', '$q'];

    constructor($http: ng.IHttpService, private $q: ng.IQService) {
        super($http);
        this.$q = $q;
        this.currentIndex = 0;
    }

    public getNextWord(): ng.IPromise<Word> {
        const deferred: ng.IDeferred<{}> = this.$q.defer();

        const word = this.getWord();
        setTimeout(() => { deferred.resolve({ data: word }); }, 1000);

        return deferred.promise;
    }

    private getCurrentIndex(): number {
        if (this.currentIndex + 1 > testWords.length) {
            this.currentIndex = 0;
        }

        return this.currentIndex++;
    }

    private getWord(): Word {
        const text: string = testWords[this.getCurrentIndex()];

        return {
            unmangled: text,
            mangled: this.shuffleText(text)
        };
    }

    private shuffleText(word: string): string {
        return knuthShuffle(word.split('')).join('');
    }
}

angular.module('app.services')
       .service('wordsFeedService', WordsFeedMockService);
