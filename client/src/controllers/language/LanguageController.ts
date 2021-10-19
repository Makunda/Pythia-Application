import Language from "@/interface/language/Language";
import ApiResponseImpl from "@/utils/ApiResponseImpl";
import ProxyAxios from "@/utils/ProxyAxios";

export default class LanguageController {
  /**
   * Get the list of supported languages
   * @param filter (Optional) Filter the language list
   */
  public static async getLanguages(
    filter?: string,
  ): Promise<ApiResponseImpl<Language[]>> {
    let accountRoute = "api/language/all";

    if (filter) {
      accountRoute += "?search=" + filter; // add options
    }

    return ProxyAxios.get(accountRoute);
  }
}
