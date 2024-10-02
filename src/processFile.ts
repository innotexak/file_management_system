import crypto from "crypto";
import {S3Storage} from "./awsService.js";
import {v4 as uuid} from 'uuid'
import __File from './ models/file.js'
import {NextFunction, Response} from "express";
import {CustomRequest} from "./route.js";
import FileService from "./fileService.js";


class FileProcessService extends FileService {
  async requestFileUpload(req: CustomRequest, res: Response, next: NextFunction): Promise<any> {

    const {contentType, businessId} = req.body
    const envData: IValidatedKeys = req.keyData
    const {isTest} = envData

    const key: string = uuid()
    const file: any = await new S3Storage({contentType, key}).createUploadLink(key)
    const {fields, url} = file
    const formatedFields = {
      key: fields.key,
      bucket: fields.bucket,
      acl: fields.acl,
      XAmzAlgorithm: fields["X-Amz-Algorithm"],
      XAmzCredential: fields["X-Amz-Credential"],
      XAmzDate: fields["X-Amz-Date"],
      Policy: fields.Policy,
      XAmzSignature: fields["X-Amz-Signature"]
    }
    const processToken = `NA_SE-${crypto.randomBytes(16).toString('hex')}-END`;

    const temp= await this.createFile({
      businessId,
      key: fields.key,
      processToken,
      url,
      fileType: contentType,
    })

   if(!temp){
     res.status(400).json({error: true, message: "Unable to create or commit file", data:temp})
   }else{
     res.status(200).json({
       data: {
         fields: formatedFields, url, _id: temp._id, processToken
       },
       message: "File uploaded initiated",
       error: false
     })
   }

  }


  async getSignedUrl(req: CustomRequest, res: Response) {
    const file: any = await this.getFileByKey(req.params.key)
    if (!file) {
      res.status(400).json({error: true, message: "File not found"})
    } else {
      const {key, url} = file
      res.redirect(`${url}/${key}`)
    }

  }

  async deleteFile(req: CustomRequest, res: Response) {
    const file = this.deleteFileByKye(req.params.key)
    if (!file) {
      res.status(400).json({error: true, message: "File not found"})
    } else {
      res.status(200).json({message: "file deleted successfully", error: false})
    }
  }


  async markUploadAsCompleted(req: CustomRequest, res: Response) {
    const {fileId, uploaded} = req.body
    const file = await this.updateFileById(fileId, {uploaded})
    if (!file) {
      res.status(400).json({error: true, message: "File not found"})
    } else {
      res.status(200).json({message: `${file ? "File updated successfully":"unable to update file"} `, error: false})
    }

  }
}

export default FileProcessService