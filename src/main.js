import chalk from 'chalk';
import fs from 'fs';
import ncp from 'ncp';
import path from 'path';
import { promisify } from 'util';
import execa from 'execa';
import Listr from 'listr';
import { projectInstall } from 'pkg-install';
import { generateBundles } from './generateBundles/generateBundles';

const access = promisify(fs.access);
const copy = promisify(ncp);


export async function stew(options) {
    options = {
        ...options,
        targetDirectory: options.targetDirectory || process.cwd(),
    };
    
    const tasks = new Listr([
        {
            title: 'Adding JHipster cubes to chickpea stew (generating bundles)',
            task: () => generateBundles(options),
        }
    ]);
    
    await tasks.run();
    console.log('%s Chickpea stew is ready to eat', chalk.green.bold('DONE'));
    return true;
    
}
