export default interface CveModel {
    vendor: string;
    product: string;
    version: string;
    vulnerabilities: [{
        name: string
        link: string
        description: string
        cweId: string
        cweLabel: string
        cvssScore: number
        criticity: string
        cpe: string
    }];
}
