const express = require('express')
const PORT = process.env.PORT || 8989

const mySqlConnection = require('./databaseHelpers/mySqlWrapper')
const accessTokenDBHelper = require('./databaseHelpers/accessTokensDBHelper')(mySqlConnection)
const userDBHelper = require('./databaseHelpers/userDBHelper')(mySqlConnection)
const oAuthModel = require('./authorization/accessTokenModel')(userDBHelper, accessTokenDBHelper)
const oAuth2Server = require('node-oauth2-server')

var myParser = require("body-parser")

var expressApp = express();

expressApp.oauth = oAuth2Server({
  model: oAuthModel,
  grants: ['password'],
  debug: true
})

const restrictedAreaRoutesMethods = require('./restrictedArea/restrictedAreaRoutesMethods.js')(userDBHelper)
const restrictedAreaRoutes = require('./restrictedArea/restrictedAreaRoutes.js')(express.Router(), expressApp, restrictedAreaRoutesMethods)
const authRoutesMethods = require('./authorization/authRoutesMethods')(userDBHelper)
const authRoutes = require('./authorization/authRoutes')(express.Router(), expressApp, authRoutesMethods)

expressApp.use(myParser.urlencoded({extended : true}))

//set the oAuth errorHandler
expressApp.use(expressApp.oauth.errorHandler())

//set the authRoutes for registration and & login requests
expressApp.use('/auth', authRoutes)

//set the restrictedAreaRoutes used to demo the accesiblity or routes that ar OAuth2 protected
expressApp.use('/restrictedArea', restrictedAreaRoutes)

expressApp.get('/', async (req, res) => {
	res.send({'message':'Hello World!'});
  });

expressApp.post("/insertProfile", async (req, res) => {
  	console.log(req.body);
	try {
		const client = await pool.connect()
      	const result = await client.query("INSERT INTO public.user_profile (fname, lname, email) values ('" + req.body.firstname + "', '" + req.body.lastname +  "', '" + req.body.email +"');");
      	if(result.rowCount === 1){
      		res.send({'status': 'Congratulations! Successfully inserted user profile!'});
        }else{
        	res.send({'status': 'Sorry, user profile insertion failed. Please try again.'});
        }
        client.release();
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  });

expressApp.get('/getAllProfiles', async (req, res) => {
    try {
      const client = await pool.connect()
      const result = await client.query('SELECT * FROM public.user_profile;');
      const results = { 'results': (result) ? result.rows : null};
      res.send(results);
      client.release();
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  });

  expressApp.post('/validateUser', async (req, res) => {
   
    
    var userName = req.body.username;
    var password = req.body.password;

    console.log("Username is :" + userName + " and password is :" + password);
    try {
     
      const result =  mySqlConnection.query('SELECT * FROM users where username = \'' + userName+ '\' and password = \''+ password+'\'');
      const results = { 'results': (result) ? result.rows : null};
      res.send(result);
     
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  });

expressApp.post("/insertOrder", async (req, res) => {
    console.log("request body is : " +req);
    var reqObj = JSON.parse(Object.keys(req.body)[0]);

  try {
    const client = await pool.connect()
        const result = await client.query("INSERT INTO public.fp_orders (order_date, firstname, lastname, order_amount) values ('" + reqObj.date + "', '" + reqObj.firstname + "', '" + reqObj.lastname +  "', '" + reqObj.amount +"');");
        if(result.rowCount === 1){
          res.send({'status': 'success'});
        }else{
          res.send({'status': 'fail'});
        }
        client.release();
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  });

expressApp.get('/getOrders', async (req, res) => {
    try {
      const client = await pool.connect()
      const result = await client.query('SELECT * FROM public.fp_orders;');
      const results = { 'results': (result) ? result.rows : null};
      res.send(results);
      client.release();
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  });

expressApp.listen(PORT, () => console.log(`Hello World App Listening on ${ PORT }`))
