import ProxyAxios from "@/utils/ProxyAxios";

/**
 * Highlight component script controller
 */
export default class HighlightComponentScriptController {

    /**
     * Create a script to flag the component with a tag
     * @param application Application name to tag
     * @param tag Tag to apply
     * @param filter Filter to apply to the search
     * @returns Promise returning the script when ending
     */
    public static async createScriptTag(application: string, tag: any, filter: {
        name?: string,
        technologies?: string[],
        licenses?: string[],
        cveRisk?: string[]
    }): Promise<string> {

        let body: any = {
            application: application,
            tag: tag,
        }
        if (filter.name) body["name"] = filter.name;
        if (filter.technologies) body["technologies"] = filter.technologies;
        if (filter.licenses) body["licenses"] = filter.licenses;
        if (filter.cveRisk) body["cveRisk"] = filter.cveRisk;

        let instanceRoute = `api/scripts/components/generate/tags/generic/multiple`;
        let response = await ProxyAxios.post<{ script: string }> (instanceRoute, body);
        if (response.isError ()) throw response.getErrorsAsString ();

        let script = response.getData ()["script"];
        return script.replace ("\\n", "<br />");

    }
}