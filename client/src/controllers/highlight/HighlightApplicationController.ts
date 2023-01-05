import ApiResponseImpl from "@/utils/ApiResponseImpl";
import {HighlightCredentials} from "@/interface/highlight/HighlightCredentials";
import ProxyAxios from "@/utils/ProxyAxios";
import HighlightApplication from "@/interface/highlight/HighlightApplication";

/**
 * Highlight Application controller
 */
export default class HighlightApplicationController {

    /**
     * Get the list of application by instance
     * @param instance Instance to query
     * @returns The list of the application
     */
    public static async getApplicationByInstance(instance: HighlightCredentials) : Promise<ApiResponseImpl<HighlightApplication[]>> {
        let instanceRoute = `api/highlight/instance/single/${instance._id}/applications/all`;
        return ProxyAxios.get<HighlightApplication[]>(instanceRoute);
    }

    /**
     * Get the number of application on the instance
     * @param instance Id of the instance
     * @returns The number of application on the instance
     */
    public static async getApplicationCountByInstance(instance: HighlightCredentials) : Promise<ApiResponseImpl<number>> {
        let instanceRoute = `api/highlight/instance/single/${instance._id}/applications/count`;
        return ProxyAxios.get<number>(instanceRoute);
    }
}