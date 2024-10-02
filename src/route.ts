import express, {NextFunction, Response, Request} from "express";
import {BothApiKeys, extractApiKeyInfo} from "./utils.js";
import Base from "./base.js";
import FileProcessService from "./processFile.js";

export interface CustomRequest extends Request {
  base?: any;
  keyData?: any;
}

const router = express.Router();

/** **********************************************************************
 *Initialized Keys
 * Middleware to extract and validate public/secret API keys from the request headers.
 ***********************************************************************/
router.use("/", (req: CustomRequest, res: Response, next: NextFunction) => {
  const publicKey: string = (req.headers["x-public-key"] as string) || "";
  const secretKey: string = (req.headers["x-secret-key"] as string) || "";
  const keys: BothApiKeys = {
    publicKey: extractApiKeyInfo(publicKey),
    secretKey: extractApiKeyInfo(secretKey),
  };
  const base = new Base(keys);
  req.base = base;
  base
    .validateKeys("secretKey")
    .then((result: any) => {
      req.keyData = result;
      next();
    })
    .catch((error: any) => {
      res.status(400).json({error: true, message: "Invalid keys"});
    });
});

/** **********************************************************************
 * GET api/v1/file/:key
 * Retrieve a signed URL for downloading a file.
 *
 * Request:
 * - Params:
 *   - `key`: The file's unique identifier stored on S3.
 *
 * Response:
 * - Success: Redirects to the pre-signed URL for downloading the file.
 * - Error: Returns a 400 status with an error message if the file is not found.
 ***********************************************************************/
router.get("/file/:key", async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    await new FileProcessService(req.keyData.isTest).getSignedUrl(req, res)
  } catch (err: any) {
    res.status(400).json({error: true, message: err?.message || "Invalid file upload"});
  }
})

/** **********************************************************************
 * POST /api/v1/file/request
 * Request a pre-signed URL for uploading a file.
 *
 * Request:
 * - Body:
 *   - `contentType`: The type of file (e.g., image/jpeg).
 *   - `businessId`: The ID associated with the business uploading the file.
 *
 * Response:
 * - Success: Returns pre-signed URL and required form fields for S3 upload.
 * - Error: Returns a 400 status with an error message if the request fails.
 ***********************************************************************/
router.post('/file/request', async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    await new FileProcessService(req.keyData.isTest).requestFileUpload(req, res, next)
  } catch (err: any) {
    console.log({err})
    res.status(400).json({error: true, message: err?.message || "Invalid file upload"});
  }
})

/** **********************************************************************
 * DELETE api/v1/delete/:key
 * Delete a file by its key from the system (and S3).
 *
 * Request:
 * - Params:
 *   - `key`: The file's unique identifier stored on S3.
 *
 * Response:
 * - Success: Returns a success message if the file is deleted successfully.
 * - Error: Returns a 400 status with an error message if the file is not found.
 ***********************************************************************/
router.delete('/delete/:key', async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    await new FileProcessService(req.keyData.isTest).deleteFile(req, res)
  } catch (err: any) {

    res.status(400).json({error: true, message: err?.message || "Invalid file upload"});
  }
})


/** **********************************************************************
 * PATCH api/v1/upload/status
 * Mark a file Upload as Completed from the system (and S3).
 *
 * Request:
 * - Body:
 *   - `fileId`: The ID of file (_id).
 *   - `uploaded`: Boolean .
 * Response:
 * - Success: Returns a success message if the updated successfully.
 * - Error: Returns a 400 status with an error message if the file is not found.
 ***********************************************************************/
router.patch('/upload/status', async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    await new FileProcessService(req.keyData.isTest).markUploadAsCompleted(req, res)
  } catch (err: any) {
    if (err?.extensions?.code) {
      console.log(err?.extensions?.code, err?.code)
      res
        .status(404)
        .json({message: err.message, error: true, data: []});
    } else if (err?.message.includes("Cast to ObjectId")) {
      res
        .status(400)
        .json({data:{message: "Invalid file ID", error: true, data: []}});
    } else {

      res.status(400).json({error: true, message: err?.message || "Invalid file upload"});
    }
  }
})

export default router;
