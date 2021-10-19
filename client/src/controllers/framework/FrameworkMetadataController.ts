import ApiResponseImpl from "@/utils/ApiResponseImpl";
import ProxyAxios from "@/utils/ProxyAxios";

/**
 * Query the metadata related to the framework
 */
export default class FrameworkMetadataController {
  /**
   * Get Total number of framework
   * @returns Promise returning the Framework
   */
  public static async getTechnologyList(): Promise<ApiResponseImpl<string[]>> {
    return ProxyAxios.get(`api/framework/pythia/metadata/technologies`);
  }
}
