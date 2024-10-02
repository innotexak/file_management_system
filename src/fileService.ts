import FileModel,{IFile} from "./ models/file.js";

class FileService {
  private model;

  constructor(isTest: boolean) {
    if (isTest === undefined || isTest === null) throw new Error('Invalid environment');
    this.model = FileModel(isTest);
  }

  /**
   * Create a new file document
   */
  async createFile(fileData: Partial<IFile>):Promise<IFile | null> {
    if (!fileData.businessId || !fileData.processToken) return null;
    return await this.model.create(fileData);
  }


  /**
   * Get a file by its Key
   */
  async getFileByKey(fileKey: string):Promise<IFile | null> {
    const file:IFile | null = await this.model.findOne({key:fileKey, deleted:false});
    if (!file) return null;
    return file;
  }

  /**
   * Update a file by its ID
   */
  async updateFileById(fileId: string, updateData: Partial<IFile>) {
    if (!fileId || !updateData) return null;
    const updatedFile = await this.model.updateOne({_id:fileId}, {$set: {...updateData}} );
    if (updatedFile.matchedCount > 0) return true;
    return false;
  }

  /**
   * Delete a file by its Key
   */
  async deleteFileByKye(key: string):Promise<string | null> {
    if (!key) return null;
    const deletedFile = await this.model.updateOne({key:key}, {$set: {deleted:true}});
    if (!deletedFile) return null;
    return "deleted";
  }

  /**
   * Get all files with pagination
   */
  async getAllFiles(page: number, limit: number){
    const options = { page, limit, sort: { createdAt: -1 } };
    const files = await this.model.paginate({}, options);
    if (!files || files.docs.length === 0) return null;
    return files;
  }
}

export default FileService;
