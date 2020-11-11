import fs from 'fs';
import { getJhipsterDirectoryMap } from '../../utils/directoryMap';
import { promisify } from 'util';
import { camelCase } from 'text-case';
import { Observable } from 'rxjs';
import { stewOptions as options } from '../../main';
import replaceInFile from "replace-in-file";

const readDir = promisify(fs.readdir);
const mkDir = promisify(fs.mkdir);
const copyFile = promisify(fs.copyFile);

export function generateBackendBundles () {
    return [
        {
            title: 'Heating up Garbanzo stew (generating Garbanzo bundles directories)',
            task: () => makeBundleDirectories()
        },
        {
            title: 'Adding JHipster cubes (copying JHipster files to Garbanzo bundles)',
            task: () => copyJHipsterFilesToBundles()
        }
    ];
}

/**
 *
 * @param options
 * @returns {Promise<any>}
 */
async function makeBundleDirectories () {
    return new Observable(async observer => {
        observer.next('Heat the oil in a large non-stick saucepan over a medium heat.');
        
        const jhipsterDirectoryMap = await getJhipsterDirectoryMap();
        const bundleTargetDirectory = `${options.targetDirectory}/bundles`;
        
        // Create bundle directory
        try {
            if (!fs.existsSync(bundleTargetDirectory)) {
                await mkDir(bundleTargetDirectory, { recursive: true });
            }
        } catch (e) {
            observer.error(new Error('Cannot create Garbanzo bundles directory'));
            return;
        }
        
        observer.next('Add the onion and garlic and fry gently for 2-3 minutes, stirring occasionally, until softened but not browned.');
        let models;
        try {
            models = await readDir(jhipsterDirectoryMap['models']);
        } catch (e) {
            observer.error(new Error('Cannot find JHipster cubes (cannot read Jhipster model directory)'));
            return;
        }
        
        for (const model of models) {
            if (isDir(`${jhipsterDirectoryMap['models']}/${model}`) || model.indexOf('.java') === -1) {
                continue;
            }
            
            // Get model name
            const modelName = model.split('.').shift();
            
            try {
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
            } catch (e) {
                observer.error(new Error('Cannot unwrap JHipster cubes (error creating bundle directories)'));
                return;
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
async function copyJHipsterFilesToBundles () {
    return new Observable(async observer => {
        observer.next('Add water and tomato purée to the pan. Bring the mixture to the boil.');
        const jhipsterDirectoryMap = await getJhipsterDirectoryMap();
        const bundleTargetDirectory = `${options.targetDirectory}/bundles`;
        
        observer.next('Add JHipster cubes to the pan and stir well, then reduce the heat until the mixture is simmering.');
        let models;
        try {
            models = await readDir(jhipsterDirectoryMap['models']);
        } catch (e) {
            observer.error(new Error('Cannot find JHipster cubes (cannot read Jhipster model directory)'));
            return;
        }
        
        for (const model of models) {
            if (isDir(`${jhipsterDirectoryMap['models']}/${model}`) || model.indexOf('.java') === -1) {
                continue;
            }
            
            // Get model name
            const modelName = model.split('.').shift();
            
            // Get bundle path
            const bundlePath = `${bundleTargetDirectory}/${camelCase(modelName)}`;
            
            try {
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
    
                    await replaceInFile({
                        files: `${bundlePath}/controllers/${modelName}Controller.java`,
                        from: new RegExp(`${modelName}Resource`, 'gm'),
                        to: `${modelName}Controller`
                    });
                }
            } catch (e) {
                // Do nothing
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
