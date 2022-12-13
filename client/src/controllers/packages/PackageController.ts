import ApiResponseImpl from "@/utils/ApiResponseImpl";
import ProxyAxios from "@/utils/ProxyAxios";
import {HighlightCredentials} from "@/interface/highlight/HighlightCredentials";
import Worker from "@/interface/worker/Worker";
import {Package} from "@/interface/package/Package";
import HighlightComponent from "@/interface/highlight/HighlightComponent";

export default class PackageController {


    /**
     * Get the full list of instances
     * @returns The list of Highlight Credentials
     */
    public static async getAllPackages(filters: any) : Promise<ApiResponseImpl<HighlightComponent[]>> {
        let instanceRoute = "api/highlight/component/all";
        return ProxyAxios.get<HighlightComponent[]>(instanceRoute);
    }

    /**
     * Get the number of packages for a portfolio
     * @returns The list of Highlight Credentials
     */
    public static async getAllPackagesByPortfolio(portfolioId: string, filters: any) : Promise<ApiResponseImpl<Package[]>> {
        let instanceRoute = `api/package/portfolio/${portfolioId}/all`;
        return ProxyAxios.get<Package[]>(instanceRoute);
    }

    /**
     * Get the full list of packages for a portfolio
     * @returns The list of Highlight Credentials
     */
    public static async countPackagesByPortfolio(portfolioId: string,filters: any) : Promise<ApiResponseImpl<number>> {
        let instanceRoute = `api/package/portfolio/${portfolioId}/count`;
        return ProxyAxios.get<number>(instanceRoute);
    }

    public static async countPackages(filters: any) : Promise<ApiResponseImpl<Package[]>> {
        let instanceRoute = "api/package/count";
        return ProxyAxios.get<Package[]>(instanceRoute);
    }

    /**
     * Get the list of technologies
     * @returns The list of string
=    */
    public static async getTechnologies() : Promise<ApiResponseImpl<string[]>> {
        let instanceRoute = "api/package/options/technologies";
        return ProxyAxios.get<string[]>(instanceRoute);
    }

    /**
     * Get the list of technologies
     * @returns The list of string
     =    */
    public static async getRepositories() : Promise<ApiResponseImpl<string[]>> {
        let instanceRoute = "api/package/options/repositories";
        return ProxyAxios.get<string[]>(instanceRoute);
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
