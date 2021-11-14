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
    sortBy = "",
    order = "",
    search = "",
    languages = [] as string[],
    dateFilter = -1,
  ): Promise<ApiResponseImpl<ImagingFramework[]>> {
    let batchRoute = "api/framework/imaging/batch";
    batchRoute += "?start=" + start; // add options
    batchRoute += "&end=" + end; // add options
    if (sortBy && sortBy != "") batchRoute += "&sortBy=" + sortBy;
    if (order && order != "") batchRoute += "&order=" + order;
    if (search) batchRoute += "&search=" + search;
    if (languages && languages.length > 0)
      batchRoute += `&languages=${languages.join("+")}`;
    if (dateFilter && dateFilter > 0) batchRoute += `&date=${dateFilter}`;
    return ProxyAxios.get<ImagingFramework[]>(batchRoute);
  }

  /**
   * Delete a specific imaging framework
   * @param id Id of the framework to delete
   * @returns
   */
  public static async updateFramework(
    framework: ImagingFramework,
  ): Promise<ApiResponseImpl<void>> {
    return ProxyAxios.post("api/framework/imaging/update/byId", framework);
  }

  /**
   * Get the total number of framework in the database
   * @returns
   */
  public static async getFrameworkCount(
    search: string = "",
    languages: string[] = [],
    dateFilter = -1,
  ): Promise<ApiResponseImpl<number>> {
    let route = "api/framework/imaging/count";

    // Build options
    const options: any[] = [];
    if (search && search != "") options.push("search=" + search);
    if (languages && languages.length > 0)
      options.push(`languages=${languages.join("+")}`);
    if (dateFilter && dateFilter > 0) options.push(`&date=${dateFilter}`);

    // Validate url
    if (options.length > 0) {
      route += "?" + options.join("&");
    }

    // Get route
    return ProxyAxios.get(route);
  }

  /**
   * Delete a specific imaging framework
   * @param id Id of the framework to delete
   * @returns
   */
  public static async deleteFramework(
    id: string,
  ): Promise<ApiResponseImpl<void>> {
    return ProxyAxios.delete("api/framework/imaging/remove/single", {
      id: id,
    });
  }

  /**
   * Delete a specific imaging framework
   * @param idList List of frameworks to delete
   * @returns
   */
  public static async deleteFrameworkBatch(
    idList: string[],
  ): Promise<ApiResponseImpl<void>> {
    return ProxyAxios.delete("api/framework/imaging/remove/batch", {
      idList: idList,
    });
  }
}
