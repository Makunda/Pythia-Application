import { Cookie } from "@/enum/Cookie";
import axios, { AxiosResponse } from "axios";
import Vue from "vue";
import ApiResponseImpl from "./ApiResponseImpl";
import CookieManager from "./CookieManager";

export default class ProxyAxios {
  /**
   * Get the URL
   * @returns The URL of the api
   */
  public static getURl(): string {
    console.log("process.env.NODE_ENV", process.env.NODE_ENV);
    if (process && process.env.NODE_ENV == "development") {
      return `http://localhost:3003/`;
    } else {
      return `https://cast-pythia.herokuapp.com/`;
    }
  }

  /**
   * *Build and return a config containing the header file
   * @param config The existing config
   * @returns Enriched configuration
   */
  private static async buildConfig(config?: any): Promise<any> {
    if (!config) config = {}; // Make sure the config isn't null

    // Check if the token  has been set up for pythia
    if (CookieManager.isSetAuthCookie()) {
      const cookie = CookieManager.getAuthCookie();
      config = {
        headers: {
          Authorization: `Bearer ${cookie}`,
        },
      };
    }

    return config;
  }

  /**
   * Get with Authentication
   * @param url Url to query
   * @param config (Optional) Configuration of the query
   * @returns A promise ending when the query is completed
   */
  public static async get<T>(
    url: string,
    config?: any,
  ): Promise<ApiResponseImpl<T>> {
    config = await this.buildConfig(config); // Create configuration
    url = ProxyAxios.getURl() + url; // Append base url

    try {
      const response = await axios.get(url, config);
      return new ApiResponseImpl<T>(response);
    } catch (error: any) {
      if (error.response) {
        return new ApiResponseImpl<T>(error.response);
      } else {
        throw error;
      }
    }
  }

  /**
   * Download a file as a blob
   * @param fileUrl Url of the file to download
   * @param type Type of file
   * @returns A Promise returning a blob with the type specified
   */
  public static async downloadFile(
    fileUrl: string,
    type: string,
  ): Promise<Blob> {
    const config = await this.buildConfig({ responseType: "blob" }); // Create configuration
    const url = ProxyAxios.getURl() + fileUrl; // Append base url

    return axios
      .get(url, config)
      .then((response) => {
        return new Blob([response.data], { type: type });
      })
      .catch((err: any) => {
        throw err;
      });
  }

  /**
   * Post with Authentication
   * @param url Url to query
   * @param data Data to send
   * @returns A promise ending when the query is completed
   */
  public static async post<T>(
    url: string,
    data: any,
    config?: any,
  ): Promise<ApiResponseImpl<T>> {
    config = await this.buildConfig(config); // Create configuration
    url = ProxyAxios.getURl() + url; // Append base url

    try {
      const response = await axios.post(url, data, config);
      return new ApiResponseImpl<T>(response);
    } catch (error: any) {
      if (error.response) {
        return new ApiResponseImpl<T>(error.response);
      } else {
        throw error;
      }
    }
  }

  /**
   * Put with Authentication
   * @param url Url to query
   * @param data Data to send
   * @returns A promise ending when the query is completed
   */
  public static async put<T>(
    url: string,
    data: any,
    config?: any,
  ): Promise<ApiResponseImpl<T>> {
    config = await this.buildConfig(config); // Create configuration
    url = ProxyAxios.getURl() + url; // Append base url

    try {
      const response = await axios.put(url, data, config);
      return new ApiResponseImpl<T>(response);
    } catch (error: any) {
      if (error.response) {
        return new ApiResponseImpl<T>(error.response);
      } else {
        throw error;
      }
    }
  }

  /**
   * Delete with Authentication
   * @param url Url to query
   * @returns A promise ending when the query is completed
   */
  public static async delete<T>(
    url: string,
    body?: any,
    config?: any,
  ): Promise<ApiResponseImpl<T>> {
    config = await this.buildConfig(config); // Create configuration
    url = ProxyAxios.getURl() + url; // Append base url
    if (body) config.data = body;

    try {
      const response = await axios.delete(url, config);
      return new ApiResponseImpl<T>(response);
    } catch (error: any) {
      if (error.response) {
        return new ApiResponseImpl<T>(error.response);
      } else {
        throw error;
      }
    }
  }
}
