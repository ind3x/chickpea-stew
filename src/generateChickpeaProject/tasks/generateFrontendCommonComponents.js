import fs from 'fs';
import ncp from 'ncp';
import { promisify } from 'util';
import { getJhipsterDirectoryMap } from '../../utils/directoryMap';
import path from 'path';
import { Observable } from 'rxjs';
import { stewOptions as options } from '../../main';

const mkDir = promisify(fs.mkdir);
const copy = promisify(ncp);

export function generateFrontendCommonComponents () {
    return [
        {
            title: 'Choosing Garbanzo stew seasoning (making Garbanzo common directories)',
            task: () => makeCommondComponentDirectories()
        },
        {
            title: 'Seasoning Garbanzo stew (copying JHipster files to Garbanzo common directories)',
            task: () => copyCommondComponent()
        }
    ];
}

async function makeCommondComponentDirectories () {
    return new Observable(async observer => {
        observer.next('Drain the chickpeas in a sieve and rinse under cold water. Add them to the tomato mixture and return it to a simmer.');
        
        const targetDirectory = `${options.targetDirectory}`;
        
        // Create bundle model directory and enumeration directory
        if (!fs.existsSync(`${targetDirectory}/models`)) {
            await mkDir(`${targetDirectory}/models/enumerations`, { recursive: true });
        }
        
        // Create bundle services directory
        if (!fs.existsSync(`${targetDirectory}/services`)) {
            await mkDir(`${targetDirectory}/services`, { recursive: true });
        }
        
        // Create bundle services directory
        if (!fs.existsSync(`${targetDirectory}/components`)) {
            await mkDir(`${targetDirectory}/components`);
        }
        
        // Create bundle services directory
        if (!fs.existsSync(`${targetDirectory}/utils`)) {
            await mkDir(`${targetDirectory}/utils`);
        }
        
        observer.complete();
    });
}

async function copyCommondComponent () {
    return new Observable(async observer => {
        observer.next('Add the kale to the stew and continue to simmer until tender. Season, to taste, with salt and freshly ground black pepper.');
        
        const jhipsterDirectoryMap = await getJhipsterDirectoryMap();
        const targetDirectory = `${options.targetDirectory}`;
        const templateDirectory = path.resolve(new URL(import.meta.url).pathname, '../../../../templates', options.concern);
        
        try {
            // Copy enumerations
            await copy(jhipsterDirectoryMap['enumerations'], `${targetDirectory}/models/enumerations`, {
                clobber: false
            });
            
            // Copy services from template
            await copy(`${templateDirectory}/static/services`, `${targetDirectory}/services`, {
                clobber: false
            });
            
            // Copy errors from template
            await copy(`${templateDirectory}/static/utils`, `${targetDirectory}/utils`, {
                clobber: false
            });
            
            // Copy configurations from template
            await copy(`${templateDirectory}/static/components`, `${targetDirectory}/components`, {
                clobber: false
            });
        } catch (e) {
            // console.log(e);
        }
        
        observer.complete();
    });
}
