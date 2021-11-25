import {GitHelper} from "../helper/GitHelper";
import {NewFile} from "../model/NewFile";
import {Constants} from "../constants/Constants";
import {XMLHelper} from "../helper/XMLHelper";
import {GitContextData} from "../model/GitContextData";
import {FileHelper} from "../helper/FileHelper";
import {ProbotOctokit} from "probot/lib/octokit/probot-octokit";

export class PomSupporter {

    static async release(octokit: InstanceType<typeof ProbotOctokit>, contextData: GitContextData, paths: string[],
                         message?: string): Promise<void> {
        if (!PomSupporter.validate(paths)) {
            return;
        }
        const newFiles: NewFile[] = await FileHelper.updateFiles(octokit, contextData, paths, this.updateVersion);
        await GitHelper.commit(
            octokit,
            contextData,
            newFiles,
            message || Constants.COMMIT_MESSAGE.POM);
    }

    private static async updateVersion(xmlContent: string): Promise<string> {
        const json: any = await XMLHelper.parse(xmlContent);
        json.project.version = [(Math.random() * 10).toString()];
        return await XMLHelper.build(json);
    }

    private static validate(paths: string[]): boolean {
        return Array.isArray(paths) && paths.length > 0
            && !paths.some(path => !path.endsWith(".xml"));
    }

}