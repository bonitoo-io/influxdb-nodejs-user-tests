let InfluxDB = require('influxdb-nodejs')
let assert = require('assert')

describe('InfluxDB.Connect', function(){

    describe('#Check connection', function(){

        it('should open connection on localhost', function(done){

             let connection = new InfluxDB.Connection({

                  database: 'test1'

             })


             connection.connect().then((result) => {
                 done(result)
             }).catch((e) => {
                 console.log('error', e);
                 done(e)
             });
        });

    });

    describe('#Write datapoints', function(){

        it('should write datapoints to the server', function(done){
             

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
                      done(e);
                  });
                  connection.flush().then(() => {
                      done()
                  }).catch((e) => {
                      done(e);
                  });



              }).catch((e) => {
                  console.log('error', e);
                  done(e)
              });


        })

    });

    describe('#Read datapoints', function(){

         it('should read the datapoints just written', function(done){

              let connection = new InfluxDB.Connection({

                  database: 'test1'

              })

              connection.connect().then((result) => {
                  connection.executeQuery('select * from power').then((result) => {
                      console.log(result)
                  }).catch((e) => {
                      console.log('error', e)
                  })
              }).catch((e) => {
                  console.log('error', e)
              });


         })

    });

});