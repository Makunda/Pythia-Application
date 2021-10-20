import { Framework, FrameworkCreation } from "@/interface/framework/Framework";
import ApiResponseImpl from "@/utils/ApiResponseImpl";
import APIUtils from "@/utils/ApiUtils";
import Copy from "@/utils/Copy";
import ProxyAxios from "@/utils/ProxyAxios";

/**
 * Handling the route related to the account of the user
 */
export default class FrameworkController {
  /**
   * Ge the list of properties you can sort on
   * @returns List of property
   */
  public static getSortByProps(): string[] {
    return [
      "name",
      "description",
      "location",
      "createdByUser",
      "validated",
      "views",
    ];
  }

  /**
   * Get account info for the current user
   * @returns Promise returning the current user data
   */
  public static async getPopularFrameworkList(
    limit: number,
  ): Promise<ApiResponseImpl<Framework[]>> {
    let accountRoute = "api/framework/pythia/all";
    accountRoute += "?end=" + limit; // add options
    accountRoute += "&order=desc&start=0&sortBy=view";

    return ProxyAxios.get(accountRoute);
  }

  /**
   * Delete a specific framework
   * @param id Id of the framework to delete
   * @returns
   */
  public static async deleteFramework(
    id: string,
  ): Promise<ApiResponseImpl<void>> {
    const accountRoute = `api/framework/pythia/delete`;
    return ProxyAxios.delete(accountRoute, { frameworkID: id });
  }

  /**
   * Get the list of the frameworks
   * @param start Start index
   * @param end End index
   * @param sortBy Sort by
   * @param order Oder of the results
   * @returns List of framework
   */
  public static async getFrameworkList(
    start: number,
    end: number,
    sortBy: string,
    order: string,
  ): Promise<ApiResponseImpl<Framework[]>> {
    let accountRoute = "api/framework/pythia/all";
    accountRoute += "?start=" + start; // add options
    accountRoute += "&end=" + end; // add options
    if (sortBy) accountRoute += "&sortBy=" + sortBy;
    if (order) accountRoute += "&order=" + order;

    return ProxyAxios.get(accountRoute);
  }

  /**
   * Get Total number of framework
   * @returns Promise returning the Framework
   */
  public static async getTotal(): Promise<ApiResponseImpl<number>> {
    return ProxyAxios.get(`api/framework/pythia/total`);
  }

  /**
   * Get Framework by Id
   * @returns Promise returning the Framework
   */
  public static async getFrameworkById(
    id: string,
  ): Promise<ApiResponseImpl<Framework | undefined>> {
    return ProxyAxios.get(`api/framework/pythia/getById/${id}/overview`);
  }

  /**
   * Create a new Framework
   * @param framework Framework to create
   * @returns
   */
  public static async createFramework(
    framework: FrameworkCreation,
  ): Promise<ApiResponseImpl<void>> {
    const frameworkRoute = "api/framework/pythia/create";

    const body = {
      name: framework.name,
      description: framework.description,
      location: framework.location,
      patterns: framework.patterns,
      tags: framework.tags,
    };

    return ProxyAxios.post(frameworkRoute, body);
  }

  /**
   * Update a framework based on its ID
   * @param framework Framework to push
   */
  public static async updateFramework(
    framework: Framework,
    categoryId: null | string = null,
  ) {
    const body = Copy.deepCopy(framework) as any;
    if (categoryId) body.categoryId = categoryId;
    return ProxyAxios.put("api/framework/pythia/updateById", body);
  }
}
