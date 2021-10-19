import Login from "@/interface/account/Login";
import ApiResponseImpl from "@/utils/ApiResponseImpl";
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
}
