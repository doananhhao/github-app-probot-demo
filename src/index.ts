import {Probot} from "probot";
import {PomSupporter} from "./supporter/PomSupporter";
import {GitHelper} from "./helper/GitHelper";

export = (app: Probot) => {

  app.on(["pull_request.reopened", "pull_request.opened"], (context: any) => {
    const paths = ["pom.xml"];
    const contextData = GitHelper.buildContextData(
        context.payload.repository, context.payload.pull_request.head.ref);
    PomSupporter.release(context.octokit, contextData, paths);
  });

};
