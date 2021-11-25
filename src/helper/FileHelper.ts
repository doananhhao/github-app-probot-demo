import {GitContextData} from "../model/GitContextData";
import {NewFile} from "../model/NewFile";
import {GitHelper} from "./GitHelper";
import {components} from "@octokit/openapi-types";
import {ProbotOctokit} from "probot/lib/octokit/probot-octokit";

type GetRepoContentResponseDataFile = components["schemas"]["content-file"];

export class FileHelper {

    static async updateFiles(octokit: InstanceType<typeof ProbotOctokit>,
                             contextData: GitContextData, paths: string[],
                             callback?: (context: string) => Promise<string>): Promise<NewFile[]> {

        if (!FileHelper.validate(paths)) {
            return [];
        }

        const newFiles: NewFile[] = [];
        for (const path of paths) {
            const fileResponse =
                (await GitHelper.getFile(octokit, contextData, path)).data as GetRepoContentResponseDataFile;
            const content = Buffer.from(fileResponse.content || "", "base64").toString();
            newFiles.push({
                path: path,
                content: callback
                    ? await callback(content)
                    : content
            });
        }

        return newFiles;
    }

    private static validate(paths: string[]): boolean {
        return Array.isArray(paths) && paths.length > 0;
    }

}