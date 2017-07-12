var replace = require("replace");
var pretty = require('pretty');
var remove = require('remove');
var fs = require('fs-extra');
var readline = require('readline');
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
const modeConfig = {
    zk: {
        num: 1,
        fileSrc: 'zkjs',
        title: '专科介绍'
    },
    jg: {
        num: 2,
        fileSrc: 'jgjs',
        title: '机构介绍'
    },
    zj: {
        num: 3,
        fileSrc: 'zjjs',
        title: '专家介绍'
    },
}
main();

function main() {
    var modeObj;
    rl.question(
        `请选择要发布的模块名：
        1:专科介绍
        2:机构介绍
        3:专家介绍
        `,
        function(answer) {
            if (answer == 1) {
                console.log(`你选择的是：1:专科介绍`);
                modeObj = modeConfig.zk;
            }
            if (answer == 2) {
                console.log(`你选择的是：2:机构介绍`);
                modeObj = modeConfig.jg;
            }
            if (answer == 3) {
                console.log(`你选择的是：3:专科介绍`);
                modeObj = modeConfig.zj;
            }
            rl.close();
            operation(modeObj)
        });
    // operation();
}

function operation(mode) {
    var fileUrl = './dist/index.html'
    var replaceConfig = {
        fileUrl: fileUrl,
        replaceArr: [{
            regex: `<!-- plus js -->`,
            replacement: `<script type="text/javascript">
                            debugger
                            window.config = ` + mode.num + `;
                        </script>`,
        }, {
            regex: `<!-- plus title -->`,
            replacement: mode.title,
        }]
    }
    var replaceFileConfig = {
        dellSrc: '/Users/zxs/Documents/workSpace/workFromSvn/jshtml/his/app/webs/' + mode.fileSrc,
        copySrc: './dist'
    }
    replaceStrIndex(replaceConfig);
    formatIndex(fileUrl);
    replaceFiles(replaceFileConfig);
}




function replaceFiles(config) {
    remove(config.dellSrc, function(err) {
        if (err) console.error(err);
        else console.log('success!');
        try {
            fs.copySync(config.copySrc, config.dellSrc)
            console.log('success!')
        } catch (err) {
            console.error(err)
        }
    });
}

function formatIndex(fileUrl) {
    fs.readFile(fileUrl, 'utf8', function(err, data) {
        fs.writeFileSync(fileUrl, pretty(data));
    });
}


function replaceStrIndex(config) {
    var arr = config.replaceArr;
    for (var i = 0; i < arr.length; i++) {
        var replaceItem = arr[i];
        replace({
            regex: replaceItem.regex,
            replacement: replaceItem.replacement,
            paths: [config.fileUrl],
            recursive: true,
            silent: false,
        })
    }
}
