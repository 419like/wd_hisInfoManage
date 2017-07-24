const ftp = require('xftp');

ftp.createServer(function(client) {

    client.on('put', function(req) {
        req.pipe(fs.createWriteStream(req.filename));
    });

    client.on('get', function(filename) {
        return fs.createReadStream(filename);
    });

    client.on('list', function() {
        return [
            [755, 1, 1000, 1000, 3023, new Date, 'Vagrantfile']
        ];
    });

}).listen(21, function(err) {
    console.log('server is running');
});

ftp.connect({ port: 21, host: '172.16.110.168' }, function(err) {

    this.on('ready', function() {
        console.log(this.name);

        this.user('ftp', function(err, res) {
            if (err.code == 331) this.pass('123', done);
        });

    });


    function done() {

        this.list(function(err, res) {
            console.log(res);
        });

    }

});