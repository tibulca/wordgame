import {Word} from "../entities/word";

export interface IWordsFeedService {
    getNextWord(): ng.IPromise<Word>;
}