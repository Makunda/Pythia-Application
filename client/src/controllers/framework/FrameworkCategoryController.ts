import FrameworkCategory from "@/interface/framework/FrameworkCategory";
import ApiResponseImpl from "@/utils/ApiResponseImpl";
import Copy from "@/utils/Copy";
import ProxyAxios from "@/utils/ProxyAxios";

/**
 * Handling the route related to the categories
 * GET /api/framework/pythia/categories/search
 * GET /api/framework/pythia/categories/getRoots
 * GET /api/framework/pythia/categories/getById/:id
 * GET /api/framework/pythia/categories/getChildrenById/:id
 * POST /api/framework/pythia/categories/createCategory
 * DELETE /api/framework/pythia/categories/delete
 * PUT /api/framework/pythia/categories/update
 */
export default class FrameworkCategoryController {
  /**
   * Search in category
   * @returns Promise returning the categories
   */
  public static async searchCategories(
    search: string,
    limit: number,
  ): Promise<ApiResponseImpl<FrameworkCategory[]>> {
    let accountRoute = "api/framework/pythia/categories/search";
    accountRoute += "?search=" + search; // add options
    accountRoute += "&limit=" + limit;

    return ProxyAxios.get(accountRoute);
  }

  /**
   * Get roots category
   * @returns Promise returning the categories
   */
  public static async getRoots(): Promise<
    ApiResponseImpl<FrameworkCategory[]>
  > {
    return ProxyAxios.get("api/framework/pythia/categories/getRoots");
  }

  /**
   * Get roots category
   * @returns Promise returning the categories
   */
  public static async getChildrenById(
    id: string,
  ): Promise<ApiResponseImpl<FrameworkCategory[]>> {
    return ProxyAxios.get(
      `api/framework/pythia/categories/getChildrenById/${id}`,
    );
  }

  /**
   * Get category by id
   * @returns Promise returning the categories
   */
  public static async getCategoryById(
    id: string,
  ): Promise<ApiResponseImpl<FrameworkCategory>> {
    return ProxyAxios.get(`api/framework/pythia/categories/getById/${id}`);
  }

  /**
   * Create a new category
   * @returns Promise returning the categories
   */
  public static async createCategory(
    category: FrameworkCategory,
    parentId: string | null,
  ): Promise<ApiResponseImpl<FrameworkCategory>> {
    const body = category as any;
    body.parentId = parentId;
    return ProxyAxios.post(`api/framework/pythia/categories/create`, category);
  }

  /**
   * Delete a category
   * @returns Promise returning the categories
   */
  public static async deleteCategory(
    id: string,
  ): Promise<ApiResponseImpl<FrameworkCategory>> {
    return ProxyAxios.delete(`api/framework/pythia/categories/delete`, {
      id: id,
    });
  }

  /**
   * Update a category by its is
   * @returns Promise returning the categories
   */
  public static async updateCategory(
    category: FrameworkCategory,
    parentId: string | null,
  ): Promise<ApiResponseImpl<FrameworkCategory>> {
    const body = Copy.deepCopy(category) as any;
    body.id = category._id;
    body.parentId = parentId;

    return ProxyAxios.put(`api/framework/pythia/categories/update`, body);
  }
}
