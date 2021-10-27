import { Framework, FrameworkCreation } from "@/interface/framework/Framework";
import FrameworkCategory from "@/interface/framework/FrameworkCategory";
import ApiResponseImpl from "@/utils/ApiResponseImpl";
import ProxyAxios from "@/utils/ProxyAxios";

/**
 * Handle the reviews routes
 * GET /api/framework/pythia/review/total
 * GET /api/framework/pythia/review/getList
 */
export default class FrameworkReviewController {
  /**
   * Get the list of frameworks to review
   * @param limit Limit number of frameworks
   * @param filterOnValidation Filters on the violations
   * @param filterOnCategory Filters on the categories
   * @returns Promise returning the categories
   */
  public static async getFrameworkList(
    limit: number,
    filterOnValidation = true,
    filterOnCategory = true,
  ): Promise<ApiResponseImpl<Framework[]>> {
    let accountRoute = "api/framework/pythia/review/getList";
    accountRoute += "?limit=" + limit; // add options
    accountRoute += "&validation=" + filterOnValidation; // add options
    accountRoute += "&category=" + filterOnCategory; // add options

    return ProxyAxios.get(accountRoute);
  }

  /**
   * Get the total number of frameworks to review
   * @param limit Limit number of frameworks
   * @param filterOnValidation Filters on the violations
   * @param filterOnCategory Filters on the categories
   * @returns Promise returning the number of frameworks to validate
   */
  public static async getNumber(
    filterOnValidation = true,
    filterOnCategory = true,
  ): Promise<ApiResponseImpl<number>> {
    let accountRoute = "api/framework/pythia/review/total";
    accountRoute += "?validation=" + filterOnValidation; // add options
    accountRoute += "&category=" + filterOnCategory; // add options

    return ProxyAxios.get(accountRoute);
  }

  /**
   * Toggle the validation of one framework by id
   * @param id Id of framework to toggle
   * @returns
   */
  public static async toggleValidationById(
    id: string,
  ): Promise<ApiResponseImpl<boolean>> {
    //http://localhost:3003/617487b6c5c4fc54e07206aa
    let accountRoute =
      "api/framework/pythia/review/toggle/validation/byId?id=" + id;
    return ProxyAxios.get(accountRoute);
  }
}
