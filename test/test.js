let InfluxDB = require('influxdb-nodejs')
let assert = require('assert')

function sleep(ms){
    return new Promise(resolve => setTimeout(resolve,ms));
}

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

                  connection.write([dataPoint1, dataPoint2]).then(() => {
                      // for now do nothing
                  }).catch((e) => {
                      done(e);
                  });
                  connection.flush().then(() => {
                      done()
                  }).catch((e) => {
                      console.log('ERROR ON FLUSH')
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
                      done()
                  }).catch((e) => {
                      console.log('QUERY EXEC ERROR')
                      done(e)
                  })
              }).catch((e) => {
                  console.log('error', e)
                  done(e)
              });


         })

    });

    describe('#Drop datapoints', function(){

         it('should drop datapoints from the database', function(done){

             let connection = new InfluxDB.Connection({

                  database: 'test1'

              })


              connection.connect().then((result) => {
                    connection.executeQuery('drop measurement power').then((result) => {
                        done()
                    }).catch((e) => {
                        console.log('DROP QUERY EXEC ERROR')
                        done(e)
                    })

              }).catch((e) => {
                    console.log('error',e)
                    done(e)
              });

         })

    });


});

describe('InfluxDB.types', function(){

  let connection = new InfluxDB.Connection({
        database: 'test1'
  })

  connection.connect().then((result) => {

      describe('#floats', function(){

         it('should write floats in all formats', function(done){
            let dPF1 = {
               measurement: 'powerf',
               timestamp: new Date().getTime() + 1000000,
               tags: [{key: 'location', value: 'Turbine0017'}],
               fields: [{key: 'kwatts', value: 49}]
             };

             let dPF2 = {
                measurement: 'powerf',
                timestamp: new Date().getTime() + 1000000,
                tags: [{key: 'location', value: 'Turbine0018'}],
                fields: [{key: 'kwatts', value: 49.013}]
            };

            let dPF3 = {
               measurement: 'powerf',
               timestamp: new Date().getTime() + 1000000,
               tags: [{key: 'location', value: 'Turbine0019'}],
               fields: [{key: 'kwatts', value: 5.009e+1}]
            };

            connection.write([dPF1, dPF2, dPF3]).then(() => {
            }).catch((e) = {

            });

            connection.flush().then(() => {

            }).catch((e) => {
                console.log('ERROR ON FLUSH')
                done(e);
            });

            //wait a sec for server to do its thing
            sleep(1000).then(() => {

               connection.executeQuery('select * from powerf').then((result) => {
//                    console.log(result)
                    for( dp in result){
                      switch(result[dp].location){
                            case 'Turbine0017': //49
                                assert.equal(result[dp].kwatts, 49.0)
                                break;
                            case 'Turbine0018': //49.013
                                assert.equal(result[dp].kwatts, 49.013)
                                break;
                            case 'Turbine0019': //5.009e+1
                                assert.equal(result[dp].kwatts, 50.09)
                                break;
                            default:
                                assert.fail(result[dp].kwatts,result[dp].location,
                                        'unexpected element in results array', ',')
                                break;
                      }
                    }
                    done();
               }).catch((e) => {
                    console.log('ERROR ON READ BACK')
                    done(e)
               });

             });

         });

      });
  }).catch((e) => {
       console.log('error', e)
  });
});
