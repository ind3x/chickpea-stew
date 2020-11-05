import Listr from 'listr';
import {generateBackendBundles} from './generateBackendBundles';
import {generateBackendCommonComponents} from './generateBackendCommonComponents';
import {generateFrontendBundles} from './generateFrontendBundles';
import {generateFrontendCommonComponents} from './generateFrontendCommonComponents';

export function generateChickpeaProject (options) {
    let tasks = [];
    if (['backend'].indexOf(options.concern.toLowerCase()) !== -1) {
        tasks = [
            ...tasks,
            ...generateBackendBundles(options),
            ...generateBackendCommonComponents(options)
        ];
    }
    
    if (['frontend'].indexOf(options.concern.toLowerCase()) !== -1) {
        tasks = [
            ...tasks,
            ...generateFrontendBundles(options),
            ...generateFrontendCommonComponents(options),
        ];
    }
    return new Listr(tasks);
}
