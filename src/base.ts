import crypto from 'crypto';
import {Document, Model} from "mongoose";
import {ErrorHandler} from "./errorHandler.js";
import __Service, {IService} from './ models/service.js'

    ;
import {ApiKeyInfo, BothApiKeys} from "./utils.js";

export interface ApiKeys {
    publicKey: string;
    secretKey: string;
    testPublicKey: string;
    testSecretKey: string;
}

type KeyType = "publicKey" | "secretKey";
export default class Base  {

    public message = "Invalid evnrionment"
    constructor(bothApiKeys: BothApiKeys) {
        this.bothApiKeys = bothApiKeys;
    }


    private getKeyInfo(keys: ApiKeyInfo) {

        const fieldMap: Record<string, string> = {
            'public-test': 'testPublicKey',
            'public-production': 'publicKey',
            'secret-test': 'testSecretKey',
            'secret-production': 'secretKey',
        };

        const field = fieldMap[`${keys.type}-${keys.environment}`];
        const isTest = keys.environment === 'test';
        return {field, isTest};
    }

    private readonly bothApiKeys?: BothApiKeys;


    async handleMongoError(mongo: Promise<Document>): Promise<Document> {
        return new Promise((resolve, reject) => {
            mongo.then((data) => resolve(data))
                .catch((reason) => {
                    // reject(MongooseErrorUtils.handleMongooseError(reason));
                });
        });
    }


    async generateUniqueApiKeys<T extends Document>(model: Model<T>): Promise<ApiKeys> {
        let unique = false;
        let keys: ApiKeys = {
            publicKey: '',
            secretKey: '',
            testPublicKey: '',
            testSecretKey: '',
        };

        while (!unique) {
            keys = {
                publicKey: `NA_PUB_PROD-${crypto.randomBytes(16).toString('hex')}`,
                secretKey: `NA_SEC_PROD-${crypto.randomBytes(16).toString('hex')}`,
                testPublicKey: `NA_PUB_TEST-${crypto.randomBytes(16).toString('hex')}`,
                testSecretKey: `NA_SEC_TEST-${crypto.randomBytes(16).toString('hex')}`,
            };

            const existingService :IService[] = await model.find({
                $or: [
                    {publicKey: keys.publicKey},
                    {secretKey: keys.secretKey},
                    {testPublicKey: keys.testPublicKey},
                    {testSecretKey: keys.testSecretKey},
                ],
            });

            if (existingService.length === 0) {
                unique = true;
            }
        }

        return keys;
    }


    async validateKeys(keyIs: KeyType): Promise<IValidatedKeys> {
        if (!this.bothApiKeys) throw new ErrorHandler().AuthenticationError(this.message);
        const {field, isTest} = this.getKeyInfo(this.bothApiKeys[keyIs]);
        const service:any = await __Service().findOne({[field]: this.bothApiKeys[keyIs].value});
        if (!service) throw new ErrorHandler().AuthenticationError(this.message);

        return {isTest, serviceId: service._id};
    }

}