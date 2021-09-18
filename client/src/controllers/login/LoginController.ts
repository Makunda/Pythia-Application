import { ApiResponse, ApiResponseImpl } from "@/interface/ApiResponse";
import Login from "@/interface/Login";
import APIUtils from "@/utils/ApiUtils";
import ProxyAxios from "@/utils/ProxyAxios";

export default class LoginController {
  /**
   * Send the username/password to the API and get the Authentication token 
   * @param login Struct of credentials
   * @returns API response
   */
  public static async sendLogin(login: Login): Promise<ApiResponseImpl<string>> {
    const loginRoute = APIUtils.getAPIurl() + "/login";

    const response = (await ProxyAxios.post(loginRoute, login)) as ApiResponse;
    return new ApiResponseImpl(response);
  }
}
