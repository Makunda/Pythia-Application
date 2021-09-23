export default class APIUtils {
  private static port = "3000";
  private static url = "192.168.1.13";

  /**
   * Get the location of the server
   */
  private static getWindowsLocation() {
    const getUrl = window.location;
    return getUrl.protocol + "//" + getUrl.host;
  }

  /**
   * Get the default url of the API
   * @returns {string} Return the url of the api
   */
  public static getAPIurl(): string {
    return this.getBaseUrl() + "/api";
  }

  public static getBaseUrl(): string {
    return `http://${this.url}:${this.port}`;
  }
}
