export default class Logger {
  public static log(
    type: string,
    title: string,
    text: string,
    data?: any,
    origin?: string,
  ): void {
    let display = `[${type}] ${origin? origin + " : " : ""}${title} - ${text}`;

    console.log(`%c ${display}`, "background: #222; color: #bada55");
    if (data) {
      display += `Data: ${data}`;
      console.log(display);
    }
  }

  /**
   * Success log
   * @param title Title of the message
   * @param text Text of the message
   * @param error Error to display
   * @param origin Origin of the request
   */
  public static error(title: string, text: string, error?: any, origin?: string): void {
    this.log("danger", title, text, error, origin);
  }

  /**
   * Success log
   * @param title Title of the message
   * @param text Text of the message
   * @param origin Origin of the request
   */
  public static success(title: string, text: string, origin?: string): void {
    this.log("success", title, text, origin);
  }
}
