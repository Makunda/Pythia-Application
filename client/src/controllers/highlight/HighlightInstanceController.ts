import ApiResponseImpl from "@/utils/ApiResponseImpl";
import {Framework} from "@/interface/framework/Framework";
import ProxyAxios from "@/utils/ProxyAxios";
import {HighlightCredentials} from "@/interface/highlight/HighlightCredentials";

export default class HighlightInstanceController {

    /**
     * Get the full list of instances
     * @returns The list of Highlight Credentials
     */
    public static async getAllInstance() : Promise<ApiResponseImpl<HighlightCredentials[]>> {
        let instanceRoute = "api/highlight/instance/all";
        return ProxyAxios.get<HighlightCredentials[]>(instanceRoute);
    }

    /**
     * Get a portfolio by ID
     * @param id Id of the portfolio
     * @returns
     */
    public static async getInstanceById(id: string) : Promise<ApiResponseImpl<HighlightCredentials|null>> {
        let instanceRoute = `api/highlight/instance/single/${id}`;
        return ProxyAxios.get<HighlightCredentials|null>(instanceRoute);
    }

    /**
     * Create a new Highlight instance
     * @param instance Instance to create
     */
    public static async create(
        instance: HighlightCredentials
    ): Promise<ApiResponseImpl<HighlightCredentials>> {
        let instanceCreate = "api/highlight/instance";
        return ProxyAxios.post<HighlightCredentials>(instanceCreate, instance);
    }


    /**
     * Update Highlight instance content
     * @param instance Instance to update
     */
    public static async updateComponent(
        instance: HighlightCredentials
    ): Promise<ApiResponseImpl<HighlightCredentials>> {
        let instanceCreate = `api/highlight/instance/request/update/${instance.domainId}`;
        return ProxyAxios.post<HighlightCredentials>(instanceCreate, instance);
    }

    /**
     * Create a new Highlight instance
     * @param instance Instance to create
     */
    public static async validate(
        instance: HighlightCredentials
    ): Promise<ApiResponseImpl<HighlightCredentials>> {
        let accountValidate = "api/highlight/instance/validate";
        return ProxyAxios.post(accountValidate, instance);
    }

    /**
     * Toggle the validation of one framework by id
     * @param id Id of framework to toggle
     * @returns
     */
    public static async deleteById(
        id: string,
    ): Promise<ApiResponseImpl<boolean>> {
        let accountRoute =
            "api/highlight/instance/" + id;
        return ProxyAxios.delete(accountRoute);
    }
}
