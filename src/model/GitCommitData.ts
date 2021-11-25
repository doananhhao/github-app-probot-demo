import {GitContextData} from "./GitContextData";
import {GitCreateTreeParamsTree} from "./GitCreateTreeParamsTree";

export interface GitCommitData {
    readonly context: GitContextData,
    message: string,
    currentSHA: string,
    treeSHA: string,
    blobs: GitCreateTreeParamsTree[]
}