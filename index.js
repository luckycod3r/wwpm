#!/usr/bin/env node

const commander = require('commander'),
    { prompt } = require('inquirer'),
    chalk = require('chalk'),
    fs = require('fs');
    http = require('http');
    decompress = require("decompress")

commander
    .version('1.0.0')
    .description('Package manager for w3bwave.studio');

let start = chalk.bgBlack(chalk.bold(chalk.magenta("  WWPM: "))) + chalk.reset() + " "


function checkAvailable(url){
    return new Promise((res,rej)=>{
        const request = http.get(url, function(response) {
            response.on("data",(f)=>{
                if(f.toString("utf8").includes("<html>")){
                    res("fail");
                }
                else{
                    res("allow");
                }
            })
        })
    })
}

commander
    .command('install <pname>')
    .alias('i')
    .description('Install package')
    .action((name, cmd) => {
        if(name){
            const file = fs.createWriteStream(`${name}.zip`);
                checkAvailable(`http://cdn.w3bwave.studio/wwpm/${name}.zip`).then((res)=>{
                    if(res == "allow"){
                        const request = http.get(`http://cdn.w3bwave.studio/wwpm/${name}.zip`, function(response) {
                    
                        
                        response.pipe(file);

                        file.on("finish", () => {
                            file.close();
                            console.log(start + chalk.green("Download Completed"));
                            console.log(start + chalk.yellow("Extracting..."));
                            decompress(name + ".zip", `webwave_modules/${name}`)
                            .then((files) => {
                                console.log(start + chalk.green("Extract Completed"));
                                console.log(start + chalk.yellow("Cleaning..."));
                                fs.rm(`${name}.zip`,()=>{
                                    console.log(start + chalk.green("Cleaned."));
                                    console.log(start + chalk.green(`Package ${name} download successfuly`));
                                })
                            })
                            .catch((error) => {
                                console.log(error);
                            });
                            
                        });
                
                
            });
                    }
                    else{
                        console.log(start + chalk.red("package not found"));
                    }
                })
                
        }
    });

commander
    .command('all')
    .alias('a')
    .description('Show all configuration files.')
    .action(() => {
        const files = fs.readdirSync('files');

        let data = '';
        for (let file of files) data += `${file} \n`;

        console.log(
            chalk.grey(`\nConfiguration files: \n\n${data}`)
        );
    });

commander.parse(process.argv);