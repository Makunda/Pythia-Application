import { Framework, FrameworkCreation } from "@/interface/framework/Framework";
import ApiResponseImpl from "@/utils/ApiResponseImpl";
import Logger from "@/utils/Logger";
import ProxyAxios from "@/utils/ProxyAxios";

export default class FrameworkExportController {
  /**
   * Download the full list of Imaging framework as a CSV file
   * @param minDate Minimal date
   * @param maxDate Maximum date
   * @returns A promise ending when the file has been downloaded
   */
  public static async downloadImagingExport(
    minDate = "",
    maxDate = "",
  ): Promise<void> {
    try {
      let launchExport = "api/framework/export/imagingFramework";

      const blob = await ProxyAxios.downloadFile(launchExport, "text/csv");

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "imaging-framework.csv";
      link.click();
      URL.revokeObjectURL(link.href);
    } catch (err) {
      Logger.error(
        "Download failed",
        "Failed to download the Imaging export.",
        err,
      );
      throw new Error("Failed to download the Imaging export.");
    }
  }
}
