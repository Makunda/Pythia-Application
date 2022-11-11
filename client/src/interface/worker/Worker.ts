/**
 * Worker interface
 */
export default interface Worker {
    _id?:string;
    name: string;
    architecture: string;
    platform: string;
    language: string;
    url: string;
    key: string;

    createdOn?: Date;
    lastModified?: Date;

}