import AWS, { S3 } from 'aws-sdk'
import {
  AWS_ACCESS_KEY_ID,
  AWS_BUCKET_NAME,
  AWS_SECRET_ACCESS_KEY,
  AWS_FRONT_END_CORS,
  AWS_REGION,

} from "./config/config.js";
import { ErrorHandler } from "./errorHandler.js";
import { ObjectId } from "mongoose";


type Fields = {
  [key: string]: string;
}

export interface RequestFileUploadResponseObject {
  _id?: ObjectId
  url: string;
  fields: Fields;
}

AWS.config.update({
  credentials: {
    secretAccessKey: AWS_SECRET_ACCESS_KEY as string,
    accessKeyId: AWS_ACCESS_KEY_ID as string,

  },


}); // update this with your region

const s3 = new AWS.S3({
  region: AWS_REGION as string
});


export enum IContentTypes {
  pdf = "application/pdf",
  png = "image/jpeg",
  jpeg = "image/png",
  jpg = "image/jpg",
  doc = "application/msword",
}


interface IStorage {
  key?: string,
  contentType: keyof typeof IContentTypes
}

export class S3Storage {
  private storage: S3;
  private readonly bucketName: string;
  private readonly getLink: string | undefined;
  private readonly contentType: keyof typeof IContentTypes;

  constructor({ key, contentType }: IStorage) {
    this.storage = s3
    this.bucketName = AWS_BUCKET_NAME as string
    // this.getLink = `/${url}/${key}.${contentType}`
    this.contentType = contentType

  }

  static setBucketCors(bucketName: string) {
    const corsParams = {
      Bucket: bucketName,
      CORSConfiguration: {
        CORSRules: [
          {
            AllowedHeaders: ['*'],
            AllowedMethods: ['PUT', 'POST', 'DELETE', 'GET'],
            AllowedOrigins: AWS_FRONT_END_CORS?.split(',') as []
          }
        ]
      }
    };

    s3.putBucketCors(corsParams, function (err, data) {
      if (err) {
      }
    });
  }

  get mediaLink() {
    if (!this.getLink) throw new Error('File key not passed to constructor')
    return this.getLink
  }

  createUploadLink(name: string): Promise<RequestFileUploadResponseObject> {
    const objectKey = `${name}.${this.contentType}`; // update this with your object key
    const expires = 60 * 60; // link expires in 1 hour

    const params = {
      Bucket: this.bucketName,
      ACL: 'public-read-write', // sets the object to be publicly readable
      Key: objectKey,
      Expires: expires,
      Fields: {
        acl: "public-read-write",
        key: objectKey,
      },
      Conditions: [
        ["eq", "$acl", "public-read-write"],
        ["content-length-range", 10, 10 * 1024 * 1024] // 1B to 10MB
      ],
      // Add any other parameters you want in this map
      // For instance, you could specify the ContentType if you know what file type is being uploaded
      ContentType: IContentTypes[this.contentType],
    };
    return new Promise((resolve, reject) => {
      s3.createPresignedPost(params, (err, res) => {

        if (err) {
          console.log('S3 create File Upload link error: ', err);
          reject(new ErrorHandler().UserInputError('Error uploading file'))
          return;
        }
        res.fields = { acl: "public-read-write", ...res.fields }
        resolve(res)
      });
    })
  }


  getFile(name: string): Promise<S3.Types.GetObjectOutput> {
    const params = {
      Bucket: this.bucketName,
      Key: name,
    };
    return new Promise((resolve, reject) => {
      return s3.getObject(params, (err, data) => {
        if (err) {

          return reject(new ErrorHandler().ValidationError("Error uploading file"))
        }
        console.log(data)
        resolve(data);
      });

    })
  }

  deleteFile(name: string) {
    const params = {
      Bucket: this.bucketName,
      Key: name,
    };
    return new Promise((resolve, reject) => {
      s3.deleteObject(params, function (err, data) {
        if (err) {
          console.log(err, err.stack)
        } else console.log(data);
      });

    })
  }

}

S3Storage.setBucketCors(AWS_BUCKET_NAME as string)
