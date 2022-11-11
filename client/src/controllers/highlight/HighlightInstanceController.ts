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
