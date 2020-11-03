import {generateBackendBundles} from './generateBackendBundles';

export async function generateBundles (options) {
    if (['backend', 'all'].indexOf(options.concern.toLowerCase()) !== -1) {
        generateBackendBundles(options);
    }
}
