import ApiResponseImpl from "@/utils/ApiResponseImpl";
import {HighlightCredentials} from "@/interface/highlight/HighlightCredentials";
import ProxyAxios from "@/utils/ProxyAxios";
import HighlightComponent from "@/interface/highlight/HighlightComponent";

/**
 * Highlight Application controller
 */
export default class HighlightInstanceComponentController {

    /**
     * Get the list of Component by instance
     * @param id Id of the application
     * @returns The list of the Component
     */
    public static async getComponentsByInstance(instance: HighlightCredentials): Promise<ApiResponseImpl<HighlightComponent[]>> {
        let instanceRoute = `api/highlight/instance/single/${instance._id}/components/all`;
        return ProxyAxios.get<HighlightComponent[]> (instanceRoute);
    }

    /**
     * Get the number of Component on the instance
     * @param id Id of the instance
     * @returns The number of Component on the instance
     */
    public static async getComponentCountByInstance(instance: HighlightCredentials): Promise<ApiResponseImpl<number>> {
        let instanceRoute = `api/highlight/instance/single/${instance._id}/components/count`;
        return ProxyAxios.get<number> (instanceRoute);
    }
}