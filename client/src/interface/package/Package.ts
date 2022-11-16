import CveModel from "@/interface/package/CveModel";
import LicenseModel from "@/interface/package/LicenseModel";
import CompatibilityModel from "@/interface/package/CompatibiltyModel";

export interface Package {
    _id?: string;
    package_id: string;
    name: string;
    repository: string;
    lastRelease: number;
    description: string;
    originalTechnology: string;
    technology: string;
    url: string;
    lastUsedRelease: string;
    version: string;
    licenses: [LicenseModel];
    cve: CveModel,
    compatibility: CompatibilityModel;

    portfolioIds: number[];

    createdOn: Date;
    lastModified: Date;
};