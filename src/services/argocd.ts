import { ApplicationKind } from "@application-model";
import { consoleFetchJSON } from "@openshift-console/dynamic-plugin-sdk";

export const syncApp = async (app: ApplicationKind): Promise<boolean> => {

    const response = await consoleFetchJSON("/api/proxy/plugin/gitops-admin-plugin/proxy/api/v1/applications/" + app.metadata.name + "/sync", 'POST', {
        method: 'POST',
        headers: {
            'content-type': 'application/json;charset=UTF-8',
            'Accept': 'application/json',
            'namespace': app.metadata.namespace
        }
    });

    // TODO - Look Ma, no error handling or logging
    return (response.status == 200);
}

export const refreshApp = async (app: ApplicationKind, hard: boolean): Promise<boolean> => {

    const response = await consoleFetchJSON("/api/proxy/plugin/gitops-admin-plugin/proxy/api/v1/applications/" + app.metadata.name + "?refresh=" + (hard ? 'hard' : 'normal'), 'GET', {
        headers: {
            'content-type': 'application/json;charset=UTF-8',
            'Accept': 'application/json',
            'namespace': app.metadata.namespace
        }
    });

    // TODO - Look Ma, no error handling or logging
    return (response.status == 200);
}
