var fs = require( 'fs' ),
    fsExtra = require( 'fs-extra' ),
    stat = fs.stat,
    chalk = require('chalk'),
    handlebars = require('handlebars'),
    download = require('download-git-repo'),
    symbols = require('log-symbols'),
    Exec = require('child_process').exec,
    ora = require('ora');

var config = require("../lib/config");

/*
 * Node工具
 */
var Base = {
    // Git下载
    gitDownload: function(path, dist){
        return new Promise(function (res, rej) {
            download(`direct:${path}`, dist, {clone: true}, (err) => {
                if(err){
                    rej(err);
                }else{
                    res(dist);
                }
            });
        })
    },

    // 清除Git记录
    clearGitHistory: function(path){
        fsExtra.remove(`${path}/.git`, function(err) {
          if (err) return console.error(err)
        })
    },

    // handlebars模版遍历
    replaceHandlebars: function(meta, files){
        for(var i in files){
            var fileName = files[i];
            const content = fs.readFileSync(fileName).toString();
            const result = handlebars.compile(content)(meta);
            fs.writeFileSync(fileName, result);
        }
    },

    // 创建模版
    createTemplate: function(path, dist, answers){
        const spinner = ora('正在生成创建模板...');
        spinner.start();
        this.gitDownload(path, dist).then((val) => {
            spinner.succeed();
            // 清除GIT记录
            this.clearGitHistory(dist);
            // 模版解析
            var files = [
                `${dist}/package.json`,
                `${dist}/index.html`
            ];
            var meta = {
                dist,
                title: answers.title,
                author: answers.author
            }
            // 替换模版
            this.replaceHandlebars(meta, files);

            // 更新安装组件库
            var _dirArr = __dirname.split('\\');
            _dirArr.pop();
            var _dir = _dirArr.join('/') + '/components';

            this.createComponents(config.component.path, _dir);

            // 增加自动执行tnpm install 命令

            console.log(symbols.success, chalk.green('————项目初始化完成————'));

        }).catch(function(err){
            spinner.fail();
            console.log(symbols.error, chalk.red(err));
        })
    },

    // 拉取组件库
    getComponents: function(path, dist){
        const spinner = ora('正在更新组件库...');
        spinner.start();
        this.gitDownload(path, dist).then((val) => {
            spinner.succeed();
            console.log(symbols.success, chalk.green('组件库更新完成'));
        }).catch(function(err){
            spinner.fail();
            console.log(symbols.error, chalk.red(err));
        });
    },

    // 创建组件库方法
    createComponents: function(path, dist){
        var isComponents = fs.existsSync(dist);
        // 检查组件是否存在，如果不存在则进行创建
        if(!isComponents){
            fs.mkdirSync(dist, 0777);
            this.getComponents(path, dist);
        }else{
            fsExtra.remove(dist, (err)=>{
                this.getComponents(path, dist);
            })
        }
    },

    execCommand: function(command, callback){
        Exec(command, function(e, stdout, stderr) {
        　　if(!e) {
                callback();
        　　}
        });
    },
}

module.exports = Base;