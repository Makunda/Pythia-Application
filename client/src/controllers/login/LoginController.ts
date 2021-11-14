import Login from "@/interface/account/Login";
import ApiResponseImpl from "@/utils/ApiResponseImpl";
import CookieManager from "@/utils/CookieManager";
import ProxyAxios from "@/utils/ProxyAxios";

export default class LoginController {
  /**
   * Send the username/password to the API and get the Authentication token
   * @param login Struct of credentials
   * @returns API response
   */
  public static async sendLogin(
    login: Login,
  ): Promise<ApiResponseImpl<string>> {
    return ProxyAxios.post<string>("login", login);
  }

  /**
   * Verify the token
   * @returns True if the cookie is valid, false otherwise
   */
  public static async verifyToken(): Promise<boolean> {
    if (!CookieManager.isSetAuthCookie()) return false;
    const token = CookieManager.getAuthCookie();

    // Check the response and it's status
    const response = await ProxyAxios.post<boolean>("verify/token", {
      token: token,
    });

    if (response.isSuccess()) {
      // Get the authentication
      return response.getData();
    } else {
      return false;
    }
  }
}
