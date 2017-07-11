var replace = require("replace");
var pretty = require('pretty');
var remove = require('remove');
var fs = require('fs-extra');



var fileUrl = './dist/index.html'



var replaceConfig = {
    fileUrl: fileUrl,
    replaceArr: [{
        regex: `<!-- plus js -->`,
        replacement: `<script type="text/javascript" src="cordova.js"></script>`,
    }, {
        regex: `<!-- plus meta -->`,
        replacement: `<meta http-equiv="Content-Security-Policy" content="default-src 'self' data: gap: * 'unsafe-eval'; style-src 'self' 'unsafe-inline'; media-src *; img-src * data: content:;">
    <meta name="format-detection" content="telephone=no">
    <meta name="msapplication-tap-highlight" content="no">`,
    }]
}
replaceStrIndex(replaceConfig);
formatIndex(fileUrl);
var replaceFileConfig = {
    dellSrc: '/Users/zxs/Documents/workSpace/workFromSvn/jshtml/his/app/webs/dynamicColumnManage',
    copySrc: './dist'
}
replaceFiles(replaceFileConfig);



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
