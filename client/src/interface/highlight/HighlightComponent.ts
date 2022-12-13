import HighlightCWE from "@/interface/highlight/HighlightCWE";
import HighlightLicense from "@/interface/highlight/HighlightLicense";
import HighlightVulnerability from "@/interface/highlight/HighlightVulnerability";

export default interface HighlightComponent {
    id: number,
    name: string,
    description: string,
    technologies: string,
    url: string,
    version: string,
    releaseDate: string,
    cwes?: HighlightCWE[],
    licenses?: HighlightLicense[],
    vulnerabilities?: HighlightVulnerability[],

    createdOn?: Date,
    lastModified?: Date
}
