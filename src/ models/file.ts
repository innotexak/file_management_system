import { Document, Model, model, ObjectId, PaginateModel, Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';


interface IFileDoc<T extends Document> extends Model<T>, PaginateModel<T> {
}

export interface IFile extends Document {
  businessId: ObjectId;
  processToken: string;
  verified: boolean
  url: string;
  key:string;
  deleted:boolean
  fileType: string;
  uploaded: boolean
}

const FileSchema = new Schema<IFile>({

    businessId: {
      type: Schema.Types.ObjectId,
      required: true,
    },

    verified: {
      type: Boolean,
      default: false
    },

    url: {
      type: String,
      trim: true,
      required:true
    },

    uploaded: {
      type: Boolean,
      default: false,
      required: true
    },

    processToken: {
      type: String,
      required: true,
      trim: true
    },

    key:{
      type:String,
    },

    fileType: {
      type: String,
      required: true,
    },

  deleted:{
      type:Boolean,
      default: false
  }
  },
  {
    versionKey: false,
    timestamps: true,
    toJSON: { virtuals: true, versionKey: false },
  });

FileSchema.plugin(mongoosePaginate);


export default function (isTest: boolean) {
  if (isTest === undefined || isTest === null) throw new Error('Invalid environment');
  const collectionName = isTest ? 'test_file' : 'file';
  return model<IFile, IFileDoc<IFile>>(collectionName, FileSchema, collectionName);

}
