# CInstance File System (CFS)

The CFS is a file management system that enables secure client-side uploads to AWS S3. It validates API keys for access and provides endpoints for file uploads, retrieval, and deletion. The system ensures secure file transfers using S3, with key validation done through x-public-key and x-secret-key headers. The CFS also supports dynamic versioning in the API routes (e.g., /api/v1/, /api/v2/).

# Features
Secure API key validation using x-public-key and x-secret-key.
File upload, retrieval, and deletion to/from AWS S3.
Dynamic API versioning for seamless upgrades without breaking backward compatibility.
JSON response format for easy integration with client-side applications.
Requirements
AWS S3 bucket and credentials.
Node.js and Express.
Redis for session/key management (optional but recommended).
Environment Variables
Make sure you have the following environment variables configured:

bash
Copy code
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_S3_BUCKET_NAME=your_bucket_name

Installation
Clone the repository:

# bash
Copy code
git clone https://github.com/your-repo/cinstance-file-system.git
cd cinstance-file-system
Install dependencies:

bash
Copy code
npm install
Create a .env file with the necessary configurations (see Environment Variables).

Run the application:


npm start
API Routes
All routes are prefixed with /api/:version/, where :version can be v1, v2, etc., for dynamic versioning.

1. File Upload Request
POST /api/:version/file/request

Initiates a request for a pre-signed URL to upload a file to AWS S3.

Headers:
x-public-key: API public key
x-secret-key: API secret key
Response:
json
Copy code
{
  "message": "Pre-signed URL generated successfully.",
  "data": {
    "uploadUrl": "https://aws-s3-url.com/upload",
    "fileUrl": "https://aws-s3-url.com/file-access-url"
  },
  "error": false
}
Error Response:
json
Copy code
{
  "message": "Invalid API keys.",
  "data": null,
  "error": true
}
2. Retrieve File
GET /api/:version/file/:key

Fetches a file from AWS S3 using the file key.

Headers:
x-public-key: API public key
x-secret-key: API secret key
Response:
json
Copy code
{
  "message": "File retrieved successfully.",
  "data": {
    "fileUrl": "https://aws-s3-url.com/file-access-url",
    "metadata": {
      "fileSize": "12345",
      "fileType": "image/png"
    }
  },
  "error": false
}
Error Response:
json
Copy code
{
  "message": "File not found.",
  "data": null,
  "error": true
}
3. Delete File
DELETE /api/:version/delete/:key

Deletes a file from AWS S3 using the file key.

Headers:
x-public-key: API public key
x-secret-key: API secret key
Response:
json
Copy code
{
  "message": "File deleted successfully.",
  "data": null,
  "error": false
}
Error Response:
json
Copy code
{
  "message": "File deletion failed.",
  "data": null,
  "error": true
}
API Key Validation
Each request requires API key validation using the x-public-key and x-secret-key headers. The keys must be valid; otherwise, the request will return an error message:

json
Copy code
{
  "message": "Invalid API keys.",
  "data": null,
  "error": true
}
Response Format
Each API response follows a consistent format:

message: A descriptive message about the outcome of the request.
data: Contains relevant data (e.g., pre-signed URLs, file metadata) if the request is successful.
error: Boolean indicating whether the request resulted in an error (true) or was successful (false).
Dynamic API Versioning
The CFS uses dynamic API versioning by accepting a :version parameter in the URL (e.g., /api/v1/, /api/v2/). This enables future upgrades and version management without breaking existing API consumers.

Example Usage
bash
Copy code
# Request a file upload
curl -X POST http://localhost:3000/api/v1/file/request \
  -H "x-public-key: your_public_key" \
  -H "x-secret-key: your_secret_key"

# Retrieve a file
curl -X GET http://localhost:3000/api/v1/file/your-file-key \
  -H "x-public-key: your_public_key" \
  -H "x-secret-key: your_secret_key"

# Delete a file
curl -X DELETE http://localhost:3000/api/v1/delete/your-file-key \
  -H "x-public-key: your_public_key" \
  -H "x-secret-key: your_secret_key"
License
This project is licensed under the MIT License - see the LICENSE file for details.

