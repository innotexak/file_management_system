import {Schema, Document, model, ObjectId, Model, PaginateModel} from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';


export interface IEnvData {
  isTest:boolean,
  serviceId: ObjectId,
}

export interface IService extends Document {
  title:string
  description:string
  status:"ACTIVE" | "INACTIVE"
  publicKey: string,
  secretKey: string,
  testPublicKey: string,
  testSecretKey: string,
}


interface IServiceDoc<T extends Document> extends Model<T>, PaginateModel<T> { }

const serviceSchema: Schema = new Schema<IService>({

    title: {
      type: String,
      index:true,
      lowercase:true,
      trim:true,
      required: true,
    },

    description:{
      type:String,
      lowercase:true,
    },
    status:{
      type:String,
      enum:["ACTIVE", "INACTIVE"],
      trim:true,
      default:"ACTIVE",
      required: true,
    },

    publicKey: {
      type: String,
      required: true,
      index: true,
      unique: true
    },
    secretKey: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    testPublicKey: {
      type: String,
      required: true,
      index: true,
      unique: true
    },
    testSecretKey: {
      type: String,
      required: true,
      index: true,
      unique: true
    }

  },
  {
    versionKey: false,
    timestamps: true,
    toObject: {
      virtuals: true,
    },
    toJSON: { virtuals: true, versionKey: false },
  }
);

serviceSchema.plugin(mongoosePaginate)

export default function (isTest: boolean = false) {
  if (isTest === undefined || isTest === null) throw new Error('Invalid environment');
  const collectionName = isTest ? 'test_service' : "service";
 return  model<IService, IServiceDoc<IService>>(collectionName, serviceSchema, collectionName);

}

