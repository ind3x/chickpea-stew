import fs from 'fs';
import ncp from 'ncp';
import { promisify } from 'util';
import { getJhipsterDirectoryMap } from '../directoryMap';
import path from 'path';
import { Observable } from 'rxjs';

const mkDir = promisify(fs.mkdir);
const copyFile = promisify(fs.copyFile);
const copy = promisify(ncp);

export function generateBackendCommonComponents (options) {
    return [
        {
            title: 'Choosing Garbanzo stew seasoning (making Garbanzo common directories)',
            task: () => makeCommondComponentDirectories(options)
        },
        {
            title: 'Seasoning Garbanzo stew (copying JHipster files to Garbanzo common directories)',
            task: () => copyCommondComponent(options)
        }
    ];
}

async function makeCommondComponentDirectories (options) {
    return new Observable(async observer => {
        observer.next('Drain the chickpeas in a sieve and rinse under cold water. Add them to the tomato mixture and return it to a simmer.');
        const targetDirectory = `${options.targetDirectory}`;
        
        // Create bundle model directory and enumeration directory
        if (!fs.existsSync(`${targetDirectory}/models`)) {
            await mkDir(`${targetDirectory}/models/enumerations`, { recursive: true });
        }
        
        // Create bundle repository directory
        if (!fs.existsSync(`${targetDirectory}/repositories`)) {
            await mkDir(`${targetDirectory}/repositories`);
        }
        
        // Create bundle services directory
        if (!fs.existsSync(`${targetDirectory}/services`)) {
            await mkDir(`${targetDirectory}/services/dto`, { recursive: true });
        }
        
        // Create bundle services directory
        if (!fs.existsSync(`${targetDirectory}/mappers`)) {
            await mkDir(`${targetDirectory}/mappers`);
        }
        
        // Create bundle services directory
        if (!fs.existsSync(`${targetDirectory}/controllers`)) {
            await mkDir(`${targetDirectory}/controllers`);
        }
        
        // Create bundle services directory
        if (!fs.existsSync(`${targetDirectory}/queryParameters`)) {
            await mkDir(`${targetDirectory}/queryParameters`);
        }
        
        // Create bundle services directory
        if (!fs.existsSync(`${targetDirectory}/errors`)) {
            await mkDir(`${targetDirectory}/errors`);
        }
        
        // Create bundle services directory
        if (!fs.existsSync(`${targetDirectory}/configurations`)) {
            await mkDir(`${targetDirectory}/configurations`);
        }
        
        observer.complete();
    });
}

async function copyCommondComponent (options) {
    return new Observable(async observer => {
        observer.next('Add the kale to the stew and continue to simmer until tender. Season, to taste, with salt and freshly ground black pepper.');
        
        const jhipsterDirectoryMap = await getJhipsterDirectoryMap(options);
        const targetDirectory = `${options.targetDirectory}`;
        const templateDirectory = path.resolve(new URL(import.meta.url).pathname, '../../../templates', options.concern);
        
        try {
            // Copy enumerations
            await copy(jhipsterDirectoryMap['enumerations'], `${targetDirectory}/models/enumerations`, {
                clobber: false
            });
    
            // Copy EntityMapper
            await copyFile(`${jhipsterDirectoryMap['mappers']}/EntityMapper.java`, `${targetDirectory}/mappers/EntityMapper.java`);
    
            // Copy services from template
            await copy(`${templateDirectory}/static/services`, `${targetDirectory}/services`, {
                clobber: false
            });
    
            // Copy errors from template
            await copy(`${templateDirectory}/static/errors`, `${targetDirectory}/errors`, {
                clobber: false
            });
    
            // Copy configurations from template
            await copy(`${templateDirectory}/static/configurations`, `${targetDirectory}/configurations`, {
                clobber: false
            });
        } catch (e) {
            // console.log(e);
        }
        
        observer.complete();
    });
}
