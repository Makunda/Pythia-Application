import { Pattern } from "@/interface/framework/Pattern";
import ApiResponseImpl from "@/utils/ApiResponseImpl";
import ProxyAxios from "@/utils/ProxyAxios";

export default class FrameworkStatisticsController {
  /**
   * Get the list of pattern, matching the framework id
   * @param id Id of the framework
   */
  public static getTotalNumberOfFramework(
    id: string,
  ): Promise<ApiResponseImpl<number>> {
    let url = "api/pattern/getByFramework?id=" + id;
    return ProxyAxios.get(url);
  }
}
