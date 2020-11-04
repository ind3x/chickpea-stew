import Listr from 'listr';
import {generateBackendBundles} from './generateBackendBundles';
import {generateBackendCommondComponents} from './generateBackendCommonComponents';

export function generateChickpeaProject (options) {
    let tasks = [];
    if (['backend'].indexOf(options.concern.toLowerCase()) !== -1) {
        tasks = [
            ...tasks,
            ...generateBackendBundles(options),
            ...generateBackendCommondComponents(options)
        ];
    }
    return new Listr(tasks);
}
