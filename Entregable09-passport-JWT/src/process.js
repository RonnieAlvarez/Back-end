import { Command } from 'commander'

const program = new Command();

program
    .option('-d', 'Variable para debug', false)
    .option('-p <port>', 'Puerto del server', 3033)
    .option('--mode <mode>', 'Modo de trabajo', 'develop')
    .requiredOption('-u <user>', 'El user que va usar la aplicación', 'User')

program.parse() //Parsea los comandos y valida si son correctos.

console.log("Options: ", program.opts());
console.log("Mode Option: ", program.opts().mode);
console.log("Remaining arguments: ", program.args);


export default program;