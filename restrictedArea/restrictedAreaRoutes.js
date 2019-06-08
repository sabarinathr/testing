module.exports =  (router, expressApp, restrictedAreaRoutesMethods) => {

    //route for entering into the restricted area.
    router.post('/enter',  expressApp.oauth.authorise(), restrictedAreaRoutesMethods.accessRestrictedArea)


    router.post('/hello',  expressApp.oauth.authorise(), restrictedAreaRoutesMethods.sayHello)

    return router
}
