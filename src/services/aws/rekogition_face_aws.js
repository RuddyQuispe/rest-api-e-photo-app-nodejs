//Copyright 2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.
//PDX-License-Identifier: MIT-0 (For details, see https://github.com/awsdocs/amazon-rekognition-developer-guide/blob/master/LICENSE-SAMPLECODE.)

export function compareFaceInPhotos(photo1, photo2) {
    const AWS = require('aws-sdk');
    const bucket = 'bucket-e-photo-app-sw1'; //bucketname without s3://
    const photo_source = photo1;
    const photo_target = photo2;
    AWS.config.update({ region: 'us-east-1' });
    // console.log("region: ",AWS.region);
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
    // cantiner in Promise
    let promise = new Promise((resolve, reject) => {
        try {
            client.compareFaces(params, function (err, data) {
                console.log("Function rekognition");
                if (err) {
                    console.log("Cai en error", err);
                    console.log(err, err.stack); // an error occurred
                } else {
                    console.log("data rekognition", data);
                    if (data.FaceMatches.length > 0) {
                        let flag = false;
                        for (let index = 0; index < data.FaceMatches.length; index++) {
                            if ((data.FaceMatches[index].Similarity) > 70) {
                                console.log("response data", data.FaceMatches[index].Similarity);
                                console.log("boolean value", data.FaceMatches[index].Similarity > 80);
                                flag = true;
                                resolve((data.FaceMatches[index].Similarity) > 70);
                            }
                        }
                        if (!flag) {
                            resolve((data.FaceMatches[index].Similarity) > 70);
                        }
                    } else {
                        reject("Doesn't not exists comparision");
                    }
                }
            });
        } catch (error) {
            reject(`Error in compare face compareFaceInPhotos(${photo1}, ${photo2})`);
        }
    });
    return promise;
}