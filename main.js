// Initialize the Amazon Cognito credentials provider
AWS.config.region = 'ap-northeast-1'; // Region
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
  IdentityPoolId: identityPoolId,
});
AWS.config.credentials.get(function(err) {
  if (!err) {
    console.log("Cognito Identity Id: " + AWS.config.credentials.identityId);
  }
});

// S3
var s3 = new AWS.S3();
var bucket_obj_list = $("#bucket_obj_list");
var recentlyBucketObjectNames = new Array();
var updateBucketObjectNames = function() {
  s3.listObjects({
    Bucket: bucketId,
    Prefix: publicFileKeyPrefix
  },
  function (err, data) {
    if (err) {
      console.log('Could not load objects from S3.');
    } else {
      recentlyBucketObjectNames = new Array();
      for (var i = 0; i < data.Contents.length; i++) {
        var key = data.Contents[i].Key;
        if (key == publicFileKeyPrefix) {
          continue;
        }
        recentlyBucketObjectNames.push(key);
      }
      console.log(recentlyBucketObjectNames);
      bucket_obj_list.data("names", recentlyBucketObjectNames);
    }
  });
};
var getImages = function() {
  var names = bucket_obj_list.data('names');
  bucket_obj_list.empty();
  for(var i in names) {
    s3.getSignedUrl('getObject',
    {
      Bucket: bucketId,
      Key: names[i]
    },
    function(err, url) {
      if (err) {
        console.log(err);
      } else {
        bucket_obj_list.append("<img class='thumnail' src='" + url + "' />");
      }
    });
  }
};
