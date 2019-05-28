#!/usr/bin/env node
const fs = require('fs');
const program = require('commander');
const inquirer = require('inquirer');
const chalk = require('chalk');
const opn = require('opn');
const symbols = require('log-symbols');
const config = require("./lib/config");
const ora = require('ora');
const fsExtra = require( 'fs-extra' );

const BASE = require("./lib/index.js");

/**
 * 模版创建 init
 * <project> 模版项目名
 * <name> 创建的模版名称
 */
program.version('1.0.0', '-v, --version')
    .command('init <project> <name>')
    .action((project, name) => {
        const result = config.templateList.find( fruit => fruit.name === project );
        console.log(chalk.yellow(`正在解析：${result.desc}`));
        if(!fs.existsSync(name)){
            inquirer.prompt([
                {
                    name: 'title',
                    message: '请输入项目标题',
                    default: ''
                },
                {
                    name: 'author',
                    message: '请输入作者名称',
                    default: ''
                }
            ]).then((answers) => {
                // 创建模版
                BASE.createTemplate(result.path, name, answers);
            })
        }else{
            // 错误提示项目已存在，避免覆盖原有项目
            console.log(symbols.error, chalk.red('项目已存在'));
        }        
    })

program
    .command('list')
    .action(() => {
        inquirer.prompt([
                {
                    name: 'projectAssets',
                    type: 'list',
                    message: '请选择模板:',
                    choices: [
                        {
                            name: 'QQGame-PC专题模版',
                            value: 'A',
                            checked: true   // 默认选中
                        },
                        {
                            name: 'QQGame-移动端专题模版',
                            value: 'B'
                        },
                        {
                            name: 'WeGame-PC专题模版',
                            value: 'wegame'
                        },
                        {
                            name: 'WeGame-移动端专题模版',
                            value: 'm-wegame'
                        }
                    ]
                },
                {
                    name: 'projectName',
                    message: '【必填】请输入项目文件名(wegame-xxx-20190520)',
                    default: ''
                },
                {
                    name: 'title',
                    message: '请输入项目描述'
                },
                {
                    name: 'author',
                    message: '请输入作者名称'
                }

            ]).then((answers) => {
                if(answers.projectName == '') {
                    console.log(chalk.red('######未输入项目名称，无法创建项目######'));
                    return false;
                }
                const result = config.templateList.find( fruit => fruit.name === answers.projectAssets );
                console.log(chalk.yellow(`正在解析：${result.desc}`));

                // 创建模版
                BASE.createTemplate(result.path, answers.projectName, answers); 
            })
    })

// 主要用于组件更新
program
    .command('update')
    .action(()=>{
        var dist = `${__dirname}/components`;
        BASE.createComponents(config.component.path, dist);
    })

/**
 * 组件插入 insert
 * <project> 组件对应项目名
 * <templateName> 模版名 <c1, c2, c3....>
 */
program
    .command('insert <project> <templateName>')
    .action((project, templateName)=>{
        var pressent = `${__dirname}/components/component-${project}`;
        var dist = 'components'
        var isProject = fs.existsSync(pressent);
        // 检查项目是否存在
        if(!isProject){console.log(chalk.red('#####项目组件不存在，请输入正确的组件名#####')); return false;} 
        var isComponents = fs.existsSync(dist);
        if(!isComponents) fs.mkdirSync(dist, 0777);
        var templateArr = templateName.split(',');

        const spinner = ora('正在生成组件...');
        spinner.start();
        for(var i in templateArr){
            var _dist = templateArr[i];
            fsExtra.copy(`${pressent}/${_dist}`, `${dist}/${_dist}`).then(() => {
                spinner.succeed();
                console.log(symbols.success, chalk.green(`[${dist}/${_dist}] 组件生成完成`));
            }).catch(err => {
                spinner.fail();
                console.log(symbols.error, chalk.red(err));
            })
        }
    })

    // .action((tna,name)=>{
    //     const serter = ora('正在嵌套模块...');
    //     serter.start();
    //     bbq=tna.split(',');
    //     ccc=[];
    //     ddd=[];
    //     eee=[];
    //     fff=[];
    //     for(let jm=0;jm<bbq.length;jm++){
    //         /* ---*/
    //         let tmle=['html','css','js'];
    //         for(let i=0;i<tmle.length;i++){
    //             switch(i){
    //                 case 0:
    //                 fs.readFile(''+name+'/index.html', 'utf-8', function(err, data) {
    //                     if (err) {
    //                         throw err;
    //                     }
    //                     console.log('ass');
    //                     fs.readFile('./Model/'+tmle[i]+'/'+bbq[jm]+'.'+tmle[i]+'','utf-8',function(err,mesage){
    //                         if(err){throw err;}
    //                         /*字符串之间的内容查找 s*/
    //                         btg=mesage.match(/\<script\stype\=\'text\/javascript\'\ssrc\=\'(\S*)\'\>\<\/script\>/g);
    //                         ddd.push(btg);
    //                         abtr=ddd.join('');
    //                         /*特殊插入 s*/
                            
    //                         /*特殊插入 e*/
    //                         vam=mesage.includes('script');
    //                         if(vam){
    //                             bbd=mesage.replace(btg,' ');
    //                         }
    //                         if(btg==null){
    //                             bbd=mesage;
    //                         }
    //                         /*字符串之间的内容查找 e*/
    //                         ccc.push(bbd);
    //                         abg=ccc.join('');
    //                         let ford=data.replace(/\<\!\-\-SetModel\sS\-\-\>/g, abg);
                            
    //                         fs.writeFile(''+name+'/index.html', ford, function (err) {
    //                             if (err) throw err;
    //                             fs.readFile(''+name+'/index.html','utf-8',function(err,atreg){
    //                                 if(err){throw err;}
                                    
    //                                 let fordtd=atreg.replace(/\<\!\-\-SetModeljs\sS\-\-\>/g, abtr);
    //                                 fs.writeFile(''+name+'/index.html', fordtd, function (err) {
    //                                     if (err) throw err;
    //                                 });
    //                             })
    //                         });
                           
                           
    //                     });   
    //                 });
    //                 break;
    //                 case 1:
    //                 fs.readFile(''+name+'/css/site.css','utf-8', function(err, data) {
    //                     if (err) {
    //                         throw err;
    //                     }
    //                     fs.readFile('./Model/'+tmle[i]+'/'+bbq[jm]+'.'+tmle[i]+'','utf-8',function(err,mesage){
    //                         if(err){throw err;}
    //                         eee.push(mesage);
    //                         vert=eee.join('');
    //                         let ford=data.replace(/\/\*SetModel\sS\*\//g, vert);
    //                         fs.writeFile(''+name+'/css/site.css',ford,function(err){
    //                             // console.log(chalk.green('√')+'  '+'样式嵌套成功');
                                
    //                         })
    //                     });   
    //                 });
    //                 break;
    //                 case 2:
    //                 fs.readFile(''+name+'/js/public.js','utf-8', function(err, data) {
    //                     if (err) {
    //                         throw err;
    //                     }
    //                     fs.readFile('./Model/'+tmle[i]+'/'+bbq[jm]+'.'+tmle[i]+'','utf-8',function(err,mesage){
    //                         if(err){throw err;}
    //                         fff.push(mesage);
    //                         ytur=fff.join('');
    //                         let ford=data.replace(/\/\*SetModel\sS\*\//g, ytur);
    //                         fs.writeFile(''+name+'/js/public.js',ford,function(err){
    //                             // console.log(chalk.green('√')+'  '+'js嵌套成功');
                                
    //                         })
    //                     });   
    //                 });
    //                 break;
    //             }   
    //         }
    //         /* ---*/
            
    //     }
        
    //     setTimeout(() => {
    //         serter.text = 'html嵌套成功';
    //         serter.succeed();
    //     }, 200);
    //     setTimeout(() => {
    //         serter.text = '外部js引入成功';
    //         serter.succeed();
    //     }, 400);
    //     setTimeout(() => {
    //         serter.text = '样式嵌套成功';
    //         serter.succeed();
    //     }, 600);
    //     setTimeout(() => {
    //         serter.text = 'js嵌套成功';
    //         serter.succeed();
    //     }, 800);

    //     /* */
        
    //     /* */

    // })



program.parse(process.argv);


