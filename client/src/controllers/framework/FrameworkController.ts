import { ApiResponse, ApiResponseImpl } from "@/interface/ApiResponse";
import { Framework, FrameworkCreation } from "@/interface/framework/Framework";
import APIUtils from "@/utils/ApiUtils";
import ProxyAxios from "@/utils/ProxyAxios";

/**
 * Handling the route related to the account of the user
 */
export default class FrameworkController {
  /**
   * Get account info for the current user
   * @returns Promise returning the current user data
   */
  public static async getPopularFrameworkList(
    limit: number
  ): Promise<ApiResponseImpl<Framework[]>> {
    let accountRoute = APIUtils.getAPIurl() + "/framework/all";
    accountRoute += "?end=" + limit; // add options
    accountRoute += "&order=desc&start=0&sortBy=view";

    const response = (await ProxyAxios.get(accountRoute)) as ApiResponse;
    return new ApiResponseImpl(response);
  }

  /**
   * Get Framework by Id
   * @returns Promise returning the Framework
   */
  public static async getFrameworkById(
    id: string
  ): Promise<ApiResponseImpl<Framework | undefined>> {
    const accountRoute =
      APIUtils.getAPIurl() + `/framework/getById/${id}/overview`;

    const response = (await ProxyAxios.get(accountRoute)) as ApiResponse;
    return new ApiResponseImpl(response);
  }

  /**
   * Create a new Framework
   * @param framework Framework to create
   * @returns
   */
  public static async createFramework(
    framework: FrameworkCreation
  ): Promise<ApiResponseImpl<void>> {
    const frameworkRoute = APIUtils.getAPIurl() + "/framework/create";

    const body = {
      name: framework.name,
      description: framework.description,
      location: framework.location,
      patterns: framework.patterns,
      tags: framework.tags,
    };

    const response = (await ProxyAxios.post(
      frameworkRoute,
      body
    )) as ApiResponse;
    return new ApiResponseImpl(response);
  }
}
