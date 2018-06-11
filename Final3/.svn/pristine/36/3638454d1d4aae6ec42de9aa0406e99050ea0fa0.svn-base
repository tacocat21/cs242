
var sendImageToServer = function(imageUri, fileName, fileType, successFunction){
    data = {"data_uri":imageUri, "fileName":fileName, "fileType":fileType};
    axios.post("/api/image", data).then(function (result) {

        successFunction(result['data']);
        console.log("IMAGE SAVED");
    }).catch(function (error) {
        console.log(error);
    });
};


var getImage = function(imageName, successFunction){
    axios.get("/api/image/" + imageName).then(function(result){
        console.log(successFunction);
        successFunction(result['data']);
    }).catch(function(err){
        console.log(err);
    });
};

