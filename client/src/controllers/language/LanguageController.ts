import { ApiResponse, ApiResponseImpl } from "@/interface/ApiResponse";
import Language from "@/interface/language/Language";
import APIUtils from "@/utils/ApiUtils";
import ProxyAxios from "@/utils/ProxyAxios";

export default class LanguageController {
  /**
   * Get the list of supported languages
   * @param filter (Optional) Filter the language list
   */
  public static async getLanguages(
    filter?: string
  ): Promise<ApiResponseImpl<Language[]>> {
    let accountRoute = APIUtils.getAPIurl() + "/language/all";

    if (filter) {
      accountRoute += "?search=" + filter; // add options
    }

    const response = (await ProxyAxios.get(accountRoute)) as ApiResponse;
    return new ApiResponseImpl(response);
  }
}
