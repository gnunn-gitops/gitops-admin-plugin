import { ApplicationKind } from "@application-model";
import { ArgoServer } from "@gitops-utils/gitops";
import { consoleFetchJSON } from "@openshift-console/dynamic-plugin-sdk";

export const syncApp = async (server:ArgoServer, token: string, app: ApplicationKind):Promise<boolean> => {

    const response = await consoleFetchJSON(server.protocol + "://" + server.host + "/api/v1/applications/" + app.metadata.name + "/sync", 'POST', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + token,
            'content-type': 'application/json;charset=UTF-8',
            'Accept': 'application/json'
        }
    });

    // TODO - Look Ma, no error handling or logging
    return (response.status == 200);
}

export const refreshApp = async (server:ArgoServer, token: string, app: ApplicationKind, hard: boolean):Promise<boolean> => {

    const response = await consoleFetchJSON(server.protocol + "://" + server.host + "/api/v1/applications/" + app.metadata.name + "?refresh=" + (hard?'hard':'normal'), 'GET', {
        headers: {
            'Authorization': 'Bearer ' + token,
            'content-type': 'application/json;charset=UTF-8',
            'Accept': 'application/json'
        }
    });

    // TODO - Look Ma, no error handling or logging
    return (response.status == 200);
}
