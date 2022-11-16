import ApiResponseImpl from "@/utils/ApiResponseImpl";
import ProxyAxios from "@/utils/ProxyAxios";
import {HighlightCredentials} from "@/interface/highlight/HighlightCredentials";
import Worker from "@/interface/worker/Worker";
import {Package} from "@/interface/package/Package";

export default class PackageController {


    /**
     * Get the full list of instances
     * @returns The list of Highlight Credentials
     */
    public static async getAllPackages(filters: any) : Promise<ApiResponseImpl<Package[]>> {
        let instanceRoute = "api/package/all";
        return ProxyAxios.get<Package[]>(instanceRoute);
    }

    public static async countPackages(filters: any) : Promise<ApiResponseImpl<Package[]>> {
        let instanceRoute = "api/package/count";
        return ProxyAxios.get<Package[]>(instanceRoute);
    }


    /**
     * Create a new Highlight instance
     * @param instance Instance to create
     */
    public static async create(
        instance: Package
    ): Promise<ApiResponseImpl<Package>> {
        let instanceCreate = "api/package/";
        return ProxyAxios.post<Package>(instanceCreate, instance);
    }


}
