import execa from 'execa';
import chalk from 'chalk';
import { promisify } from 'util';
import fs from 'fs';

const readFile = promisify(fs.readFile);

export async function checkJhipsterConfig (options) {
    try {
        await readFile(`${options.sourceDirectory}/.yo-rc.json`);
        await readFile(`${options.sourceDirectory}/application.jdl`);
        return true;
    } catch (e) {
        console.error('%s Cannot find JHipster cubes', chalk.red.bold('ERROR'));
        process.exit(1);
    }
}

export async function execJhipster (options) {
    const result = await execa('jhipster', ['--force', '--skip-install'], {
        cwd: options.sourceDirectory
    });
    if (result.failed) {
        return Promise.reject(new Error('An elderly woman has buyed the last JHipster cubes (error creating JHipster application)'));
    }
    return Promise.resolve('Done');
}

export async function importJhipsterJdl (options) {
    const result = await execa('jhipster', ['import-jdl', 'application.jdl'], {
        cwd: options.sourceDirectory
    });
    if (result.failed) {
        return Promise.reject(new Error('You has messed up with your JHipster cubes (cannot import JDL)'));
    }
    return Promise.resolve('Done');
}
