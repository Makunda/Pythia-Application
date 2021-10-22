import { Pattern } from "@/interface/framework/Pattern";
import ApiResponseImpl from "@/utils/ApiResponseImpl";
import ProxyAxios from "@/utils/ProxyAxios";

/**
 * Handling the route related to the account of the user
 */
export default class PatternController {
  /**
   * Get the list of pattern, matching the framework id
   * @param id Id of the framework
   */
  public static getPatternByFrameworkId(
    id: string,
  ): Promise<ApiResponseImpl<Pattern[]>> {
    let url = "api/pattern/getByFramework?id=" + id;
    return ProxyAxios.get(url);
  }
}
