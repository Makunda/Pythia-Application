import {HighlightCredentials} from "@/interface/highlight/HighlightCredentials";
import ApiResponseImpl from "@/utils/ApiResponseImpl";
import HighlightApplication from "@/interface/highlight/HighlightApplication";
import ProxyAxios from "@/utils/ProxyAxios";

/**
 * Class in charge of the line of code
 */
export default class HighlightLineOfCodeController {

    /**
     * Get the list of application by instance
     * @param id Id of the application
     * @returns The list of the application
     */
    public static async getLineOfCodeByInstance(instance: HighlightCredentials) : Promise<ApiResponseImpl<number|null>> {
        let instanceRoute = `api/highlight/instance/single/${instance._id}/loc/count`;
        return ProxyAxios.get<number|null>(instanceRoute);
    }
}