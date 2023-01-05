import ApiResponseImpl from "@/utils/ApiResponseImpl";
import ProxyAxios from "@/utils/ProxyAxios";
import Worker from "@/interface/worker/Worker";

export default class WorkerController {

    /**
     * Get the full list of supported languages
     * @returns The list of Highlight Credentials
     */
    public static async getTechnologies(): Promise<ApiResponseImpl<string[]>> {
        let instanceRoute = "api/assessment/worker/language";
        return ProxyAxios.get<string[]> (instanceRoute);
    }

    /**
     * Get the full list of supported platforms
     * @returns The list of supported platforms
     */
    public static async getPlatforms() : Promise<ApiResponseImpl<string[]>> {
        let instanceRoute = "api/assessment/worker/platform";
        return ProxyAxios.get<string[]>(instanceRoute);
    }

    /**
     * Get the full list of supported architecture
     * @returns The list of supported architecture
     */
    public static async getArchitectures() : Promise<ApiResponseImpl<string[]>> {
        let instanceRoute = "api/assessment/worker/architecture";
        return ProxyAxios.get<string[]>(instanceRoute);
    }

    /**
     * Get the full list of instances
     * @returns The list of Highlight Credentials
     */
    public static async getAllInstance() : Promise<ApiResponseImpl<Worker[]>> {
        let instanceRoute = "api/assessment/worker/all";
        return ProxyAxios.get<Worker[]>(instanceRoute);
    }

    /**
     * Create a new Highlight instance
     * @param instance Instance to create
     */
    public static async create(
        instance: Worker
    ): Promise<ApiResponseImpl<Worker>> {
        let instanceCreate = "api/assessment/worker/create";
        return ProxyAxios.post<Worker>(instanceCreate, instance);
    }

    /**
     * Create a new Highlight instance
     * @param instance Instance to create
     */
    public static async validate(
        instance: Worker
    ): Promise<ApiResponseImpl<Worker>> {
        let instanceCreate = "api/assessment/worker/validate";
        return ProxyAxios.post<Worker> (instanceCreate, instance);
    }

    /**
     * Create a new Highlight instance
     * @param instance Instance to create
     */
    public static async ping(
        instance: Worker
    ): Promise<ApiResponseImpl<boolean>> {
        let instanceCreate = `api/assessment/worker/ping/authenticated/${instance._id}`;
        return ProxyAxios.get<boolean> (instanceCreate, instance);
    }


    /**
     * Toggle the validation of one framework by id
     * @param id Id of framework to toggle
     * @returns
     */
    public static async deleteById(
        id: string,
    ): Promise<ApiResponseImpl<boolean>> {
        let accountRoute =
            "api/assessment/worker/delete" + id;
        return ProxyAxios.delete (accountRoute);
    }

    /**
     * Update a worker
     * @param editedItem Item to update
     */
    static async update(editedItem: Worker): Promise<ApiResponseImpl<Worker>> {
        let instanceUpdate = `api/assessment/worker/update/${editedItem._id}`;
        return ProxyAxios.post<Worker> (instanceUpdate, editedItem);
    }
}
