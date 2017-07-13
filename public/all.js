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
    operation(modeConfig.zk);
    operation(modeConfig.jg);
    operation(modeConfig.zj);
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
    var replaceFileConfig = {
        dellSrc: '/Users/zxs/Documents/workSpace/workFromSvn/jshtml/his/app/webs/wbyygl/zyjsgl/' + mode.fileSrc,
        copySrc: './dist'
    }
    replaceFiles(replaceFileConfig,replaceConfig);
}




function replaceFiles(config,replaceConfig) {
    remove(config.dellSrc, function(err) {
        if (err) console.error(err);
        else console.log('delete success!');
        try {
            fs.copySync(config.copySrc, config.dellSrc)
            console.log('copy success!')
            replaceStrIndex(replaceConfig);
            formatIndex(replaceConfig.fileUrl);
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
