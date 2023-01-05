import ApiResponseImpl from "@/utils/ApiResponseImpl";
import HighlightComponent from "@/interface/highlight/HighlightComponent";
import ProxyAxios from "@/utils/ProxyAxios";
import HighlightApplication from "@/interface/highlight/HighlightApplication";
import {HighlightCredentials} from "@/interface/highlight/HighlightCredentials";

export default class HighlightComponentController {

    /**
     * Get the list of technology
     * @returns The list of the technology
     */
    public static async getComponentTechnologyNames(): Promise<ApiResponseImpl<string[]>> {
        let instanceRoute = `api/highlight/components/technologies/all/name`;
        return ProxyAxios.get<string[]> (instanceRoute);
    }

    /**
     * Get the list of cves criticality
     * @returns The list of the cves criticality
     */
    public static async getComponentCVEsCriticalityNames(): Promise<ApiResponseImpl<string[]>> {
        let instanceRoute = `api/highlight/components/cves/criticality/all/risk`;
        return ProxyAxios.get<string[]> (instanceRoute);
    }

    /**
     * Get the list of technology
     * @returns The list of the technology
     */
    public static async getComponentLicenseNames(): Promise<ApiResponseImpl<string[]>> {
        let instanceRoute = `api/highlight/components/licenses/all/name`;
        return ProxyAxios.get<string[]> (instanceRoute);
    }


    /**
     * Get the list of components matching the name
     * @returns The list of components
     */
    public static async searchComponents(filter: {
        name?: string,
        technologies?: string[],
        licenses?: string[],
        cveRisk?: string[]
    }): Promise<ApiResponseImpl<HighlightComponent[]>> {
        let instanceRoute = `api/highlight/components/search/byFilter`;
        return ProxyAxios.post<HighlightComponent[]> (instanceRoute, filter);
    }

    /**
     * Get the list of components matching the name
     * @returns The list of components
     */
    public static async countComponents(filter: {
        name?: string,
        technologies?: string[],
        licenses?: string[],
        cveRisk: string[]
    }): Promise<ApiResponseImpl<number>> {
        let instanceRoute = `api/highlight/components/count/byFilter`;
        return ProxyAxios.post<number> (instanceRoute, filter);
    }

    /**
     * Get the list of components by application
     * @param portfolio Portfolio to query
     * @param application Application to query
     * @returns The list of components
     */
    public static async getComponentsByApplication(
        portfolio: HighlightCredentials,
        application: HighlightApplication
    ): Promise<ApiResponseImpl<HighlightComponent[]>> {
        let instanceRoute = `api/highlight/components/portfolio/${portfolio._id}/application/${application._id}`;
        return ProxyAxios.get<HighlightComponent[]> (instanceRoute);
    }


}