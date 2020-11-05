import chalk from 'chalk';
import Listr from 'listr';
import { generateChickpeaProject } from './generateChickpeaProject/generateChickpeaProject';
import { execJhipster, importJhipsterJdl, checkJhipsterConfig } from './jhipster';

export async function stew (options) {
    options = {
        ...options,
        targetDirectory: options.targetDirectory || process.cwd()
    };
    
    let tasks = [
        {
            title: `Buying JHipster cubes (generating JHipster application from detected)`,
            task: () => execJhipster(options),
            enabled: () => options.jhipster && checkJhipsterConfig(options)
        },
        {
            title: `Putting in place JHipster cubes (importing JHipster JDL)`,
            task: () => importJhipsterJdl(options),
            enabled: () => options.jhipster && checkJhipsterConfig(options)
        },
        {
            title: `Cooking Chickpea stew (generating Chickpea ${options.concern} project)`,
            task: () => generateChickpeaProject(options)
        }
    ];
    
    await (new Listr(tasks)).run().then(ctx => {
        console.log('%s Chickpea stew is ready to eat', chalk.green.bold('DONE'));
    }).catch(err => {
        // console.error('%s %s', chalk.red.bold('ERROR'), err);
    });
    
    return true;
}
