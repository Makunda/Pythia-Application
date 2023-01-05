export default interface HighlightApplicationThirdParty {
    snapshotLabel: string,
    snapshotDate: number,
    applicationCodeLines: number,
    applicationFiles: number,
    thirdPartyCodeLines: number,
    thirdPartyFiles: number,
    thirdParties: [{
        id: number,
        componentId: string,
        name: string,
        version: string,
        release: number,
        languages: string,
        origin: string,
        licenses: [],
        lastVersion: string,
        lastRelease: number,
        nbVersionPreviousYear: number,
        numberOfCodeLines: number,
        numberOfFiles: number,
        cwes: []
    }]
}