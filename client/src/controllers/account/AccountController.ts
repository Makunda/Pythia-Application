import { ApiResponse, ApiResponseImpl } from "@/interface/ApiResponse";
import User from "@/interface/User";
import APIUtils from "@/utils/ApiUtils";
import ProxyAxios from "@/utils/ProxyAxios";

export default class AccountController {

    public static async getAccountInfo() : Promise<ApiResponseImpl<User>> {
        const accountRoute = APIUtils.getAPIurl() + "/user/overview";

        const response = (await ProxyAxios.get(accountRoute)) as ApiResponse;
        return new ApiResponseImpl(response);
    }
}