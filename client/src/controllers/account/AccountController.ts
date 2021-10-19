import User from "@/interface/account/User";
import ApiResponseImpl from "@/utils/ApiResponseImpl";
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
    return ProxyAxios.get<User>("api/user/overview");
  }

  /**
   * Update account info for the current user
   * @returns Promise returning the current user data
   */
  public static async updateAccountInfo(
    newAccount: User,
  ): Promise<ApiResponseImpl<User>> {
    return ProxyAxios.post<User>("api/user/profile", newAccount);
  }
}
