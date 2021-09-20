import { ApiResponse, ApiResponseImpl } from "@/interface/ApiResponse";
import { Framework } from "@/interface/Framework/Framework";
import User from "@/interface/User";
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
}
