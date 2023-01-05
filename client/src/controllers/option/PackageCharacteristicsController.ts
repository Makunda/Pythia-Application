import WorkerController from "@/controllers/worker/WorkerController";
import Logger from "@/utils/Logger";

/**
 * Package Characteristic controller
 */
export default class PackageCharacteristicsController {
    private static loaded = false;

    private static architecturesList = [] as string[];
    private static platformList = [] as string[];
    private static technologyList = [] as string[];
    private static targetList = new Map ([
        ["dotnet", ["net6.0"]],
        ["", []]
    ]);

    static async staticConstructor(): Promise<void> {
        try {
            const response = await WorkerController.getArchitectures ();

            if (response.isError ()) throw response.getErrorsAsString ();
            this.architecturesList = response.getData () as string[];
        } catch (err) {
            Logger.error (
                "Failed to get the list of architecture",
                "Failed to get the list of architecture due to a server error.",
                err,
            );
            this.architecturesList = [];
        }

        try {
            const response = await WorkerController.getTechnologies ();

            if (response.isError ()) throw response.getErrorsAsString ();
            this.technologyList = response.getData () as string[];
        } catch (err) {
            Logger.error (
                "Failed to get the list of technology",
                "Failed to get the list of technology due to a server error.",
                err,
            );

            this.technologyList = [];
        }

        try {
            const response = await WorkerController.getPlatforms ();

            if (response.isError ()) throw response.getErrorsAsString ();
            this.platformList = response.getData () as string[];
        } catch (err) {
            Logger.error (
                "Failed to get the list of platform",
                "Failed to get the list of platforms due to a server error.",
                err,
            );
            this.platformList = [];
        }

        this.loaded = true;
    }

    /**
     * Get the list of technologies
     * @return The list of architecture
     */
    public static async getArchitectureList(): Promise<string[]> {
        if (!this.loaded) await this.staticConstructor ();
        return this.architecturesList;
    }

    /**
     * Get the list of platforms
     * @return The list of platform
     */
    public static async getPlatformsList(): Promise<string[]> {
        if (!this.loaded) await this.staticConstructor ();
        return this.platformList;
    }

    /**
     * Get the list of technologies
     * @return The list of technologies
     */
    public static async getTechnologiesList(): Promise<string[]> {
        if (!this.loaded) await this.staticConstructor ();
        return this.technologyList;
    }

    /**
     * Get target list
     * @return the map
     */
    public static async getTargetListMap(): Promise<Map<string, string[]>> {
        return this.targetList;
    }

    /**
     * Get target list by techno
     * @param technology Technology to query
     */
    public static async getTargetList(technology: string): Promise<string[] | undefined> {
        return this.targetList.get (technology);
    }

}
