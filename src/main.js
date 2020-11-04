import chalk from 'chalk';
import Listr from 'listr';
import { generateChickpeaProject } from './generateChickpeaProject/generateChickpeaProject';

export async function stew (options) {
    options = {
        ...options,
        targetDirectory: options.targetDirectory || process.cwd()
    };
    
    const tasks = new Listr([
        {
            title: `Adding JHipster cubes to Chickpea stew (generating ${options.concern} project)`,
            task: () => generateChickpeaProject(options)
        }
    ]);
    
    await tasks.run();
    console.log('%s Chickpea stew is ready to eat', chalk.green.bold('DONE'));
    return true;
    
}