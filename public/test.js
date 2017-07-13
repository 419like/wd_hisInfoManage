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

const tempUrl = './dist/index.html'
const tempSrc = './dist/'
main();

function main() {
    dell(modeConfig.zk);
    dell(modeConfig.jg);
    dell(modeConfig.zj);
    var replaceFileConfig = {
        dellSrc: '/Users/zxs/Documents/workSpace/workFromSvn/jshtml/his/app/webs/wbyygl/zyjsgl/',
        copySrc: './dist'
    }
    replaceFiles(replaceFileConfig);

}
function dell(mode){
    var replaceConfig = {
        fileUrl:tempSrc+mode.fileSrc+'.html',
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
    fs.copySync(tempUrl, replaceConfig.fileUrl);
    replaceStrIndex(replaceConfig);
    formatIndex(replaceConfig.fileUrl);
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

function replaceFiles(config) {
    remove(config.dellSrc, function(err) {
        if (err) console.error(err);
        else console.log('delete success!');
        try {
            fs.copySync(config.copySrc, config.dellSrc)
            console.log('copy success!')
            console.log('press "Ctrl+c" to quit!')

        } catch (err) {
            console.error(err)
        }
    });
}

function operation(mode) {
    var replaceConfig = {
        fileUrl: `/Users/zxs/Documents/workSpace/workFromSvn/jshtml/his/app/webs/wbyygl/zyjsgl/` + mode.fileSrc + `/index.html`,
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
