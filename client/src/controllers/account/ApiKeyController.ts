import Token from "@/interface/account/Token";
import ApiResponseImpl from "@/utils/ApiResponseImpl";
import ProxyAxios from "@/utils/ProxyAxios";

/**
 * Generation and management of API Key for this account
 */
export default class ApiKeyController {
  /**
   * Get account info for the current user
   * @returns Promise returning the current user data
   */
  public static async getAllUserToken(): Promise<ApiResponseImpl<Token[]>> {
    return ProxyAxios.get<Token[]>("api/token/all");
  }

  /**
   * Create a token with a name
   * @returns Promise returning a new token
   */
  public static async createToken(
    tokenName: string,
  ): Promise<ApiResponseImpl<string>> {
    return ProxyAxios.post<string>("api/token/create", { name: tokenName });
  }

  /**
   * Regenerate a token using its name
   * @returns Promise returning a new token
   */
  public static async regenerateToken(
    tokenName: string,
  ): Promise<ApiResponseImpl<string>> {
    return ProxyAxios.post<string>("api/token/regenerate", { name: tokenName });
  }

  /**
   * Delete a token using its name
   * @param tokenName Name of the token to delete
   * @returns
   */
  public static async deleteToken(
    tokenName: string,
  ): Promise<ApiResponseImpl<string>> {
    return ProxyAxios.delete<string>("api/token/delete", {
      name: tokenName,
    });
  }
}
