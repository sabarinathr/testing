let userDBHelper;

module.exports = injectedUserDBHelper => {

  userDBHelper = injectedUserDBHelper

  	return {
		accessRestrictedArea: accessRestrictedArea,
		sayHello: sayHello
	}
}

function accessRestrictedArea(req, res) {

    res.send('You have gained access to the area')
}

function sayHello(req, res) {

	let authHeaderComps = req.get('Authorization').split(" ");

	userDBHelper.getUserFromToken(authHeaderComps[1], (sqlError, userObj) => {

      //check if the user exists
      if (sqlError == null){

        //message to give summary to client
        res.send("Oops! Unknown error occured. Please try again.");

        return
      }

      //register the user in the db
      res.send('Hello! Welcome ' + userObj.username + '.');
    });
    
}
