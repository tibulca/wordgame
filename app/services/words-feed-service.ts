import {HttpService} from "../common/service";

export interface Word {
    unmangled: string,
    mangled: string
}

export class WordsFeedService extends HttpService {
    $q: ng.IQService;

    static $inject = ['$http', '$q'];

    constructor($http: ng.IHttpService, $q: ng.IQService) {
        super($http);
        this.$q = $q;
    }

    getWord(): ng.IPromise<Word> {
        // todo: get a random word from firebase

        var deferred = this.$q.defer();
        
        const word = {
            unmangled: 'pizza',
            mangled: 'zpaiz'
        };

        setTimeout(() => { deferred.resolve({ data: word }); }, 1000);
 
        return deferred.promise;
    }
}

angular.module('app.services')
       .service('wordsFeedService', WordsFeedService);
