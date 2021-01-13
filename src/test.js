//Copyright 2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.
//PDX-License-Identifier: MIT-0 (For details, see https://github.com/awsdocs/amazon-rekognition-developer-guide/blob/master/LICENSE-SAMPLECODE.)


const AWS = require('aws-sdk')
const bucket        = 'bucket-e-photo-app-sw1' // the bucketname without s3://
const photo_source  = 'descarga.jpg'
const photo_target  = 'test1.jpg'
AWS.config.update({ region: 'us-east-1' });
const client = new AWS.Rekognition();
const params = {
  SourceImage: {
    S3Object: {
      Bucket: bucket,
      Name: photo_source
    },
  },
  TargetImage: {
    S3Object: {
      Bucket: bucket,
      Name: photo_target
    },
  },
  SimilarityThreshold: 70
}
client.compareFaces(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log(data);
});