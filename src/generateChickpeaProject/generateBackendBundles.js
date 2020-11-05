import fs from 'fs';
import { getJhipsterDirectoryMap } from '../directoryMap';
import { promisify } from 'util';
import { camelCase } from 'text-case';
import { Observable } from 'rxjs';

const readDir = promisify(fs.readdir);
const mkDir = promisify(fs.mkdir);
const copyFile = promisify(fs.copyFile);

export function generateBackendBundles (options) {
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
            observer.error(new Error('Cannot find JHipster cubes'));
        }
        
        observer.next('Add the onion and garlic and fry gently for 2-3 minutes, stirring occasionally, until softened but not browned.');
        let models;
        try {
            models = await readDir(jhipsterDirectoryMap['models']);
        } catch (e) {
            return Promise.reject(new Error('Cannot find JHipster cubes'));
        }
        
        for (const model of models) {
            if (isDir(`${jhipsterDirectoryMap['models']}/${model}`) || model.indexOf('.java') === -1) {
                continue;
            }
            
            // Get model name
            const modelName = model.split('.').shift();
            
            // Create bundle directory
            const bundlePath = `${bundleTargetDirectory}/${camelCase(modelName)}`;
            if (!fs.existsSync(bundlePath)) {
                await mkDir(bundlePath, { recursive: true });
            }
            
            // Create bundle model directory
            if (!fs.existsSync(`${bundlePath}/models`)) {
                await mkDir(`${bundlePath}/models`, { recursive: true });
            }
            
            // Create bundle repository directory
            if (!fs.existsSync(`${bundlePath}/repositories`)) {
                await mkDir(`${bundlePath}/repositories`, { recursive: true });
            }
            
            // Create bundle services directory and dto recursively
            if (!fs.existsSync(`${bundlePath}/services/dto`)) {
                await mkDir(`${bundlePath}/services/dto`, { recursive: true });
            }
            
            // Create bundle services directory
            if (!fs.existsSync(`${bundlePath}/mappers`)) {
                await mkDir(`${bundlePath}/mappers`, { recursive: true });
            }
            
            // Create bundle services directory
            if (!fs.existsSync(`${bundlePath}/controllers`)) {
                await mkDir(`${bundlePath}/controllers`, { recursive: true });
            }
            
            // Create bundle services directory
            if (!fs.existsSync(`${bundlePath}/queryParameters`)) {
                await mkDir(`${bundlePath}/queryParameters`, { recursive: true });
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
            if (isDir(`${jhipsterDirectoryMap['models']}/${model}`) || model.indexOf('.java') === -1) {
                continue;
            }
            
            // Get model name
            const modelName = model.split('.').shift();
            const bundlePath = `${bundleTargetDirectory}/${camelCase(modelName)}`;
            
            // Copy model
            await copyFile(`${jhipsterDirectoryMap['models']}/${model}`, `${bundlePath}/models/${model}`);
            
            // Copy repository
            if (fs.existsSync(`${jhipsterDirectoryMap['repositories']}/${modelName}Repository.java`)) {
                await copyFile(
                    `${jhipsterDirectoryMap['repositories']}/${modelName}Repository.java`,
                    `${bundlePath}/repositories/${modelName}Repository.java`
                );
            }
            
            // Copy service interfaces
            if (fs.existsSync(`${jhipsterDirectoryMap['services']}/${modelName}Service.java`)) {
                await copyFile(
                    `${jhipsterDirectoryMap['services']}/${modelName}Service.java`,
                    `${bundlePath}/services/${modelName}Service.java`
                );
            }
            
            // Copy service implementation
            if (fs.existsSync(`${jhipsterDirectoryMap['services']}/impl/${modelName}ServiceImpl.java`)) {
                await copyFile(
                    `${jhipsterDirectoryMap['services']}/impl/${modelName}ServiceImpl.java`,
                    `${bundlePath}/services/${modelName}ServiceImpl.java`
                );
            }
            
            // Copy service dto
            if (fs.existsSync(`${jhipsterDirectoryMap['services']}/dto/${modelName}DTO.java`)) {
                await copyFile(
                    `${jhipsterDirectoryMap['services']}/dto/${modelName}DTO.java`,
                    `${bundlePath}/services/dto/${modelName}DTO.java`
                );
            }
            
            // Copy mappers
            if (fs.existsSync(`${jhipsterDirectoryMap['mappers']}/${modelName}Mapper.java`)) {
                await copyFile(
                    `${jhipsterDirectoryMap['mappers']}/${modelName}Mapper.java`,
                    `${bundlePath}/mappers/${modelName}Mapper.java`
                );
            }
            
            // Copy controllers
            if (fs.existsSync(`${jhipsterDirectoryMap['controllers']}/${modelName}Resource.java`)) {
                await copyFile(
                    `${jhipsterDirectoryMap['controllers']}/${modelName}Resource.java`,
                    `${bundlePath}/controllers/${modelName}Controller.java`
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
