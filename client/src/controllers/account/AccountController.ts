import { ApiResponse, ApiResponseImpl } from "@/interface/ApiResponse";
import User from "@/interface/User";
import APIUtils from "@/utils/ApiUtils";
import ProxyAxios from "@/utils/ProxyAxios";

/**
 * Handling the route related to the account of the user
 */
export default class AccountController {
  /**
   * Get account info for the current user
   * @returns Promise returning the current user data
   */
  public static async getAccountInfo(): Promise<ApiResponseImpl<User>> {
    const accountRoute = APIUtils.getAPIurl() + "/user/overview";

    const response = (await ProxyAxios.get(accountRoute)) as ApiResponse;
    return new ApiResponseImpl(response);
  }

  /**
   * Update account info for the current user
   * @returns Promise returning the current user data
   */
  public static async updateAccountInfo(
    newAccount: User
  ): Promise<ApiResponseImpl<User>> {
    const accountRoute = APIUtils.getAPIurl() + "/user/profile";

    const response = (await ProxyAxios.post(
      accountRoute,
      newAccount
    )) as ApiResponse;
    return new ApiResponseImpl(response);
  }
}
