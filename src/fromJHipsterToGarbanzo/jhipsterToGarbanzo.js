import { replaceJavaPackageName } from './tasks/replaceJavaPackageName';
import { replaceJavaImports } from './tasks/replaceJavaImports';
import Listr from 'listr';
import { stewOptions as options } from '../main';

export function jhipsterToGarbanzo () {
    let tasks = [];
    if (['backend'].indexOf(options.concern) !== -1) {
        tasks = [
            ...tasks,
            ...replaceJavaPackageName(),
            ...replaceJavaImports()
        ];
    }
    if (['frontend'].indexOf(options.concern) !== -1) {
        tasks = [];
    }
    return new Listr(tasks);
}

