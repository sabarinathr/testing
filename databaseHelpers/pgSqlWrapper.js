module.exports = {

  query: query
}

//get the pg object
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});

let connection = null;

/**
 * executes the specified sql query and provides a callback which is given
 * with the results in a DataResponseObject
 *
 * @param queryString
 * @param callback - takes a DataResponseObject
 */
function query(queryString, callback){

  //init the connection object. Needs to be done everytime as we call end()
  //on the connection after the call is complete
  try {

    //connect to the db
    connection = await pool.connect()

    //execute the query and collect the results in the callback
    const results = await connection.query(queryString);
    if(result.rowCount === 1){
      res.send({'status': 'success'});
    }else{
      res.send({'status': 'fail'});
    }
    connection.release();
    function(error, results, fields){

        console.log('pg: query: error is: ', error, ' and results are: ', results)

      //disconnect from the method
      connection.end()

      //send the response in the callback
      callback(createDataResponseObject(error, results))
    })
  } catch (err) {
      console.error(err);
      res.send("Error " + err)
    }
};

/**
 * creates and returns a DataResponseObject made out of the specified parameters.
 * A DataResponseObject has two variables. An error which is a boolean and the results of the query.
 *
 * @param error
 * @param results
 * @return {DataResponseObject<{error, results}>}
 */
function createDataResponseObject(error, results) {

    return {
      error: error,
      results: results === undefined ? null : results === null ? null : results
     }
  };
