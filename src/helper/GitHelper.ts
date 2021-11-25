import {GitContextData} from "../model/GitContextData";
import {NewFile} from "../model/NewFile";
import {GitCreateTreeParamsTree} from "../model/GitCreateTreeParamsTree";
import {GitCommitData} from "../model/GitCommitData";
import {ProbotOctokit} from "probot/lib/octokit/probot-octokit";

export class GitHelper {

    static async commit(octokit: InstanceType<typeof ProbotOctokit>,
                        contextData: GitContextData,
                        newFiles: NewFile[],
                        message: string): Promise<void> {
        if (!GitHelper.validate(newFiles)) {
            return;
        }

        const [currentCommitSha, treeSha] = await this.getSHA(octokit, contextData);
        const treeBlobs = await this.createBlobs(octokit, contextData, newFiles);

        await this.createCommit(octokit, {
            context: contextData,
            message: message,
            currentSHA: currentCommitSha,
            treeSHA: treeSha,
            blobs: treeBlobs
        });
    }

    static async getFile(octokit: InstanceType<typeof ProbotOctokit>,
                         contextData: GitContextData,
                         path: string): Promise<any> {
        return await octokit.repos.getContent({
            owner: contextData.owner,
            path: path,
            ref: contextData.ref,
            repo: contextData.repo
        });
    }

    static buildContextData(repository: any, branch: string): GitContextData {
        return {
            owner: repository.owner.login,
            ref: branch.startsWith("heads/") ? branch : `heads/${branch}`,
            repo: repository.name
        }
    }

    private static validate(newFiles: NewFile[]): boolean {
        return Array.isArray(newFiles) && newFiles.length > 0;
    }

    private static async createCommit(octokit: InstanceType<typeof ProbotOctokit>,
                                      commitData: GitCommitData): Promise<string> {
        const createTreeResult = await octokit.git.createTree({
            base_tree: commitData.treeSHA,
            owner: commitData.context.owner,
            repo: commitData.context.repo,
            tree: commitData.blobs
        });

        const newCommitResult = await octokit.git.createCommit({
            message: commitData.message,
            owner: commitData.context.owner,
            parents: [commitData.currentSHA],
            repo: commitData.context.repo,
            tree: createTreeResult.data.sha,
        });

        await octokit.git.updateRef({
            owner: commitData.context.owner,
            ref: commitData.context.ref,
            repo: commitData.context.repo,
            sha: newCommitResult.data.sha,
        });

        return newCommitResult.data.sha;
    }


    private static async getSHA(octokit: InstanceType<typeof ProbotOctokit>,
                                contextData: GitContextData): Promise<string[]> {
        const getRefResult = await octokit.git.getRef({
            owner: contextData.owner,
            ref: contextData.ref,
            repo: contextData.repo
        });
        const currentCommitSha = getRefResult.data.object.sha;

        const getCommitResult = await octokit.git.getCommit({
            commit_sha: currentCommitSha,
            owner: contextData.owner,
            repo: contextData.repo
        });
        return [currentCommitSha, getCommitResult.data.tree.sha];
    }

    private static async createBlobs(octokit: InstanceType<typeof ProbotOctokit>,
                                     contextData: GitContextData,
                                     files: NewFile[]): Promise<GitCreateTreeParamsTree[]> {
        const treeBlobs: GitCreateTreeParamsTree[] = [];
        for (const newFile of files) {
            const newBlob = await octokit.git.createBlob({
                content: newFile.content,
                encoding: "utf-8",
                owner: contextData.owner,
                repo: contextData.repo,
            });
            treeBlobs.push({
                mode: "100644",
                path: newFile.path,
                sha: newBlob.data.sha,
                type: "blob",
            });
        }
        return treeBlobs;
    }

}