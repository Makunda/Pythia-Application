import ImagingFramework from "@/interface/imaging/ImagingFramework";
import ApiResponseImpl from "@/utils/ApiResponseImpl";
import ProxyAxios from "@/utils/ProxyAxios";

export default class ImagingFrameworkController {
  /**
   * Get all  imaging framework created
   * WARNING : This list can be huge
   */
  public static getAllFramework(): Promise<
    ApiResponseImpl<ImagingFramework[]>
  > {
    return ProxyAxios.get("api/framework/imaging/all");
  }

  /**
   * Get a batch of the frameworks
   * @param start Start index
   * @param end End index
   * @param sortBy Sort by
   * @param order Oder of the results
   * @returns List of framework
   */
  public static async getBatch(
    start: number,
    end: number,
    sortBy: string,
    order: string,
  ): Promise<ApiResponseImpl<ImagingFramework[]>> {
    let batchRoute = "api/framework/imaging/batch";
    batchRoute += "?start=" + start; // add options
    batchRoute += "&end=" + end; // add options
    if (sortBy) batchRoute += "&sortBy=" + sortBy;
    if (order) batchRoute += "&order=" + order;

    return ProxyAxios.get(batchRoute);
  }

  /**
   * Delete a specific imaging framework
   * @param id Id of the framework to delete
   * @returns
   */
  public static async deleteFramework(
    id: string,
  ): Promise<ApiResponseImpl<void>> {
    return ProxyAxios.delete("api/framework/imaging/remove", {
      frameworkID: id,
    });
  }
}
