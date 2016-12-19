import {HttpService} from "../common/service";
import {IWordsFeedService} from "./iwordsfeedservice";
import {Word} from "../entities/word";

const testWords: Word[] = [
    { unmangled: 'pizza', mangled: 'zpaiz' },
    { unmangled: 'milk', mangled: 'klmi' },
    { unmangled: 'egg', mangled: 'geg' },
    { unmangled: 'pasta', mangled: 'aastp' },
    { unmangled: 'soup', mangled: 'posu' },
    { unmangled: 'steak', mangled: 'keast' },
    { unmangled: 'salad', mangled: 'laads' },
];

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
        var deferred = this.$q.defer();
        
        if (this.currentIndex + 1 > testWords.length) {
            this.currentIndex = 0;
        }

        setTimeout(() => { deferred.resolve({ data: testWords[this.currentIndex++] }); }, 1000);
 
        return deferred.promise;
    }
}

angular.module('app.services')
       .service('wordsFeedService', WordsFeedMockService);
