import Base from "./base.js";
import __Service from './ models/service.js'
import {BothApiKeys} from './utils.js'

export default class DefaultScripts {
    constructor() {
        this.defaultServiceLoaded().catch((error) => console.log("Error Adding Default Service", error));
    }

    async defaultServiceLoaded() {
        const defaultAdminData = await __Service().countDocuments({});
        const envKeys = {}
        if (!defaultAdminData) {
            const keys = await new Base(envKeys as BothApiKeys).generateUniqueApiKeys(__Service())
            const title = "File process system"
            const description:string = "CInstance File Processing System"
            await __Service().create({...keys,title, description });
            return console.log("Default File Service Added Successfully")
        }
        return console.log("Default File Service Already Added")
    }


}

