let InfluxDB = require('influxdb-nodejs')


let connection = new InfluxDB.Connection({

database: 'test1'

})

connection.connect().then((result) => {

     let dataPoint1 = {
         measurement: 'power',
         timestamp: new Date(),
         tags: {
             location: 'Turbine 0003'
         },
             fields: {kwatts: 53}
         };

         let dataPoint2 = {
             measurement: 'power',
             timestamp: new Date().getTime() + 1000000,
             tags: [{key: 'location', value: 'Turbine 0017'}],
             fields: [{key: 'kwatts', value: 48.9}]
         };

        connection.write([dataPoint1, dataPoint2]).catch((e) => {
            
        });
        connection.flush().then(() => {
             
        }).catch((e) => {
             console.log('error', e)
        });

});





