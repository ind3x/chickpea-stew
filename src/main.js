import chalk from 'chalk';
import Listr from 'listr';
import { generateGarbanzoProject } from './generateChickpeaProject/generateGarbanzoProject';
import { checkJhipsterConfig, execJhipster, importJhipsterJdl } from './jhipster';

export async function stew (options) {
    options = { ...options, targetDirectory: options.targetDirectory || process.cwd() };
    
    let tasks = [
        {
            title: `Buying JHipster cubes (creating JHipster application from detected configuration)`,
            task: () => execJhipster(options),
            enabled: () => options.jhipster && checkJhipsterConfig(options)
        },
        {
            title: `Putting in place JHipster cubes (importing JHipster JDL)`,
            task: () => importJhipsterJdl(options),
            enabled: () => options.jhipster && checkJhipsterConfig(options)
        },
        {
            title: `Cooking Garbanzo stew (generating Garbanzo ${options.concern} project)`,
            task: () => generateGarbanzoProject(options)
        }
    ];
    
    await (new Listr(tasks)).run().then(ctx => {
        console.log('%s Garbanzo stew is ready to eat', chalk.green.bold('DONE'));
    }).catch(err => {
        // console.error('%s %s', chalk.red.bold('ERROR'), err);
    });
    
    return true;
}
