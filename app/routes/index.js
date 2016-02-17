module.exports = function(app, db){

    var websites = db.collection('websites');
    var counters = db.collection('counters');
    
    app.get('/', function(request, response){

        
       //send intro webpage
        websites.find(function(err, result){
          if (err){
              console.log("db error");
          }
          result.forEach(function(entry){
              console.log(entry);
          })
          //console.log(result);
          //response.send(result);
      });
      
        counters.find(function(err, result){
          if (err){
              console.log("db error");
          }
          result.forEach(function(entry){
              console.log(entry);
          })
          //console.log(result);
          //response.send(result);
      });

        response.sendFile(process.cwd() + '/public/index.html');
      
    });
    
    app.get('/new/:url*', function(request, response){

        //get the new url
        var url = request.originalUrl.slice(5);
        //make sure the url is valid
        if (verifyWebsite(url)){
            //if it is, make sure it is not already in the database
            var check = retrieveURL(url);
            check.then(function(checkResult){
                //if website is not found, we should add it and send the information to the client
                if (checkResult == null){
                    //get the next short url number, then add the new object to the database and send it
                    var num = getNextSequence();
                      num.then(function(numResult){
                        var shorturl = numResult.value.seq;
                        var urlObj = {
                            url: url,
                            shorturl: shorturl
                        }
                        console.log("sending url " + urlObj.url + " shorturl " + urlObj.shorturl + " to client");
                        response.send(urlObj);
                        insertWebsite(urlObj);

                    })
                    
                }
                //if the website is already in the database, we should just send it to the client
                else{
                    console.log('new website ' + checkResult.url + ' already in database, sending shorturl ' + checkResult.shorturl)
                    var urlObj = {
                        url: checkResult.url,
                        shorturl: checkResult.shorturl
                    }
                    response.send(urlObj)
                }

            })

        }
        //if the url is not a valid website, send a message stating such to the client
        else{
            response.send('url not recognized as valid website');
        }
    });
    
    app.get('/:shorturl', function(request, response){
        //check if website is in db
        var shorturl = parseInt(request.params.shorturl);
        var check = retrieveShortURL(shorturl);
        check.then(function(checkResult){
            if (checkResult == null){
                response.send("website not found");
            }
            else{
                response.redirect(checkResult.url);
            }
        })
        //redirect if it is or send error message if it is not
    })
    
    function verifyWebsite(wsstr){
        //check if string is a valid web address
        console.log("verifying website " + wsstr);
        var urlregex = /^https?:\/\/\S+\.\S+/;
        return urlregex.test(wsstr);
    }

    function retrieveURL(url){
        console.log('looking up ' + url);
        return websites.findOne({
            query:{url:url}
        })
    }
    
    function retrieveShortURL(shorturl){
        console.log('looking up short url ' + shorturl)
        return websites.findOne({
            query:{shorturl:shorturl}
        })
    }
    
    function getNextSequence() {
        console.log("generating new shorturl number");
        return counters.findOneAndUpdate(
            { 'counter': "count" },
            { "$inc": { "seq": 1 } },
            {
                returnOriginal: false,
                sort: {seq: 1}
            }
         );
    }
    
    function insertWebsite(urlObj) {
        console.log("inserting website with url " + urlObj.url + " and short url " + urlObj.shorturl);
        websites.insert(urlObj);
    }
}