## Test project for influxdb-nodejs

This expects influxdb-nodejs to be installed somewhere locally.  

To add or update influxdb-nodejs to this project.

    $ cd <influxdb-nodejs>
    $ npm pack
    $ cd -
    $ npm install
    # above to install mocha 
    $ npm install --save <path-to-influxdb-nodejs>/influxdb-nodejs-1.0.0.tgz

To run mocha tests

    $ npm run


