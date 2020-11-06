import Listr from 'listr';
import { generateBackendBundles } from './tasks/generateBackendBundles';
import { generateBackendCommonComponents } from './tasks/generateBackendCommonComponents';
import { generateFrontendBundles } from './tasks/generateFrontendBundles';
import { generateFrontendCommonComponents } from './tasks/generateFrontendCommonComponents';
import { stewOptions as options } from '../main';

export function generateGarbanzoProject () {
    let tasks = [];
    if (['backend'].indexOf(options.concern) !== -1) {
        tasks = [
            ...tasks,
            ...generateBackendBundles(),
            ...generateBackendCommonComponents()
        ];
    }
    
    if (['frontend'].indexOf(options.concern) !== -1) {
        tasks = [
            ...tasks,
            ...generateFrontendBundles(),
            ...generateFrontendCommonComponents()
        ];
    }
    return new Listr(tasks);
}
