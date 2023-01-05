/**
 * List of function
 */
export default class ArrayUtils {

  /**
   * Merge unique
   * @param arr1 Array number 1
   * @param arr2 Array number 2
   * @returns
   */
  public static mergeUnique<T>(arr1: T[], arr2: T[]): T[] {
    if (!arr1) arr1 = [];
    if (!arr2) arr2 = [];

    const arr = arr1.concat (arr2);
    for (let i = 0; i < arr.length; i++) {
      for (let j = i + 1; j < arr.length; j++) {
        if (arr[i] === arr[j])
          arr.splice (j--, 1);
      }
    }

    return arr;
  }

  /**
   * Remove all the element matching the parameter
   * @param arr Array to process
   * @param value Value to remove
   */
  public static removeItemAll<T>(arr: T[], value: T): T[] {
    let i = 0;
    while (i < arr.length) {
      if (arr[i] === value) {
        arr.splice (i, 1);
      } else {
        ++i;
      }
    }
    return arr;
  }

  /**
   * Add unique value to the array
   * @param arr Array to process
   * @param value Value to remove
   */
  public static addUnique<T>(arr: T[], value: T): T[] {
    if (arr.includes (value)) return arr;
    arr.push (value);
    return arr;
  }
}
