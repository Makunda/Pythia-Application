import ApiResponseImpl from "@/utils/ApiResponseImpl";
import ProxyAxios from "@/utils/ProxyAxios";
import AssessmentStatisticModel from "@/interface/assessment/AssessmentStatisticModel";

export class AssessmentStatisticsController {

    /**
     * Get statistics for Portfolio's package
     * @param id Id of the portfolio
     * @param technology Technology to query
     * @param platform Platform to query
     * @param architecture Architecture to query
     * @param target Target to query
     */
    public static async getStatisticsByPortfolioId(id: string, technology: string, platform: string, architecture: string, target?: string):
        Promise<ApiResponseImpl<AssessmentStatisticModel>> {

        // Body
        const model = {
            technology: technology,
            platform: platform,
            architecture: architecture,
            target: target
        }

        return ProxyAxios.post<AssessmentStatisticModel> (`api/assessment/statistics/packages/portfolio/${id}`, model);
    }

    /**
     * Get statistics for Portfolio's package
     * @param portfolioId Portfolio ID
     * @param applicationId Application ID
     * @param technology Technology to query
     * @param platform Platform to query
     * @param architecture Architecture to query
     * @param target Target to query
     */
    public static async getStatisticsByApplication(portfolioId: string,
                                                   applicationId: string,
                                                   technology: string,
                                                   platform: string,
                                                   architecture: string,
                                                   target?: string):
        Promise<ApiResponseImpl<AssessmentStatisticModel>> {

        // Body
        const model = {
            technology: technology,
            platform: platform,
            architecture: architecture,
            target: target
        }

        return ProxyAxios.post<AssessmentStatisticModel> (`api/assessment/statistics/packages/portfolio/${portfolioId}/application/${applicationId}`, model);
    }

    /**
     * Create script statistics by application
     * @param portfolioId Portfolio ID
     * @param applicationId Application ID
     * @param technology Technology
     * @param platform Platform
     * @param architecture Architecture
     * @param target Target
     */
    public static async createStatisticsScriptByApplication(portfolioId: string,
                                                   applicationId: string,
                                                   technology: string,
                                                   platform: string,
                                                   architecture: string,
                                                   target?: string):
        Promise<ApiResponseImpl<string>> {

        // Body
        const model = {
            technology: technology,
            platform: platform,
            architecture: architecture,
            target: target
        }
        return ProxyAxios.post<string> (`api/assessment/statistics/packages/portfolio/${portfolioId}/application/${applicationId}/script`, model);
    }

    /**
     * Get statistics for  packages
     * @param technology Technology to query
     * @param platform Platform to query
     * @param architecture Architecture to query
     */
    public static async getStatisticsByPackage(technology: string, platform: string, architecture: string):
        Promise<ApiResponseImpl<AssessmentStatisticModel>> {

        // Body
        const model = {
            technology: technology,
            platform: platform,
            architecture: architecture
        }
        return ProxyAxios.post<AssessmentStatisticModel> (`api/assessment/statistics/packages/all`, model);
    }
}