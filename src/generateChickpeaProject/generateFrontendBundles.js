import fs from 'fs';
import { getJhipsterDirectoryMap } from '../directoryMap';
import { promisify } from 'util';
import { Observable } from 'rxjs';

const readDir = promisify(fs.readdir);
const mkDir = promisify(fs.mkdir);
const copyFile = promisify(fs.copyFile);

export function generateFrontendBundles (options) {
    return [
        {
            title: 'Heating up Chickpea stew (generating Chickpea bundles directories)',
            task: () => makeBundleDirectories(options)
        },
        {
            title: 'Adding JHipster cubes (copying JHipster files to Chickpea bundles)',
            task: () => copyJHipsterFilesToBundles(options)
        }
    ];
}

/**
 *
 * @param options
 * @returns {Promise<any>}
 */
async function makeBundleDirectories (options) {
    return new Observable(async observer => {
        observer.next('Heat the oil in a large non-stick saucepan over a medium heat.');
        
        const jhipsterDirectoryMap = await getJhipsterDirectoryMap(options);
        const bundleTargetDirectory = `${options.targetDirectory}/bundles`;
        
        // Create bundle directory
        try {
            if (!fs.existsSync(bundleTargetDirectory)) {
                await mkDir(bundleTargetDirectory, { recursive: true });
            }
        } catch (e) {
            observer.error(new Error('Cannot create Chickpea bundles directory'));
        }
        
        observer.next('Add the onion and garlic and fry gently for 2-3 minutes, stirring occasionally, until softened but not browned.');
        let models;
        try {
            models = await readDir(jhipsterDirectoryMap['models']);
        } catch (e) {
            observer.error(new Error('Cannot find JHipster cubes'));
        }
        
        for (const model of models) {
            if (isDir(`${jhipsterDirectoryMap['models']}/${model}`) || model.indexOf('.ts') === -1) {
                continue;
            }
            
            // Get model name
            const modelName = model.split('.').shift();
            
            // Create bundle directory
            const bundlePath = `${bundleTargetDirectory}/${modelName}`;
            if (!fs.existsSync(bundlePath)) {
                await mkDir(bundlePath, { recursive: true });
            }
            
            // Create bundle model directory
            if (!fs.existsSync(`${bundlePath}/models`)) {
                await mkDir(`${bundlePath}/models`, { recursive: true });
            }
            
            // Create bundle services directory and dto recursively
            if (!fs.existsSync(`${bundlePath}/services`)) {
                await mkDir(`${bundlePath}/services`, { recursive: true });
            }
            
            // Create bundle services directory
            if (!fs.existsSync(`${bundlePath}/components`)) {
                await mkDir(`${bundlePath}/components`, { recursive: true });
            }
        }
    
        observer.complete();
    });
}

/**
 * Copy
 * @param options
 * @returns {Promise<boolean>}
 */
async function copyJHipsterFilesToBundles (options) {
    new Observable(async observer => {
        observer.next('Add water and tomato purée to the pan. Bring the mixture to the boil.');
        const jhipsterDirectoryMap = await getJhipsterDirectoryMap(options);
        const bundleTargetDirectory = `${options.targetDirectory}/bundles`;
    
        observer.next('Add JHipster cubes to the pan and stir well, then reduce the heat until the mixture is simmering.');
        let models;
        try {
            models = await readDir(jhipsterDirectoryMap['models']);
        } catch (e) {
            observer.error(new Error('Cannot find JHipster cubes'));
        }
        
        for (const model of models) {
            if (isDir(`${jhipsterDirectoryMap['models']}/${model}`) || model.indexOf('.ts') === -1) {
                continue;
            }
            
            // Get model name
            const modelName = model.split('.').shift();
            const bundlePath = `${bundleTargetDirectory}/${modelName}`;
            
            // Copy model
            await copyFile(`${jhipsterDirectoryMap['models']}/${model}`, `${bundlePath}/models/${model}`);
            
            // Copy service
            if (fs.existsSync(`${jhipsterDirectoryMap['entities']}/${modelName}/${modelName}.service.ts`)) {
                await copyFile(
                    `${jhipsterDirectoryMap['entities']}/${modelName}/${modelName}.service.ts`,
                    `${bundlePath}/services/${modelName}.service.ts`
                );
            }
            
            // Copy module
            if (fs.existsSync(`${jhipsterDirectoryMap['entities']}/${modelName}/${modelName}.module.ts`)) {
                await copyFile(
                    `${jhipsterDirectoryMap['entities']}/${modelName}/${modelName}.module.ts`,
                    `${bundlePath}/${modelName}.module.ts`
                );
            }
        }
        
        observer.complete();
    });
}

/**
 * Check if given path is a directory
 * @param path
 * @returns {boolean}
 */
function isDir (path) {
    return fs.existsSync(path) && fs.lstatSync(path).isDirectory();
}
