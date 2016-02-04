module.exports = function(app, db){

    app.get('/', function(request, response){
       //send intro webpage
    });
    
    app.get('/new:newwebsite', function(request, response){
        //check if newwebsite is in db
        //if in db, send info
        //if not in db, add it and send info
    });
    
    app.get('/:website', function(request, response){
        //check if website is in db
        //redirect if it is or send error message if it is not
    })
    
    function verifyWebsite(wsstr){
        //check if string is a valid web address
    }

}