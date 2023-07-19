import { ApplicationKind, ApplicationModel, ApplicationOperation, ApplicationResourceStatus, Resource } from "@application-model";
import { annotationRefreshKey } from "@gitops-utils/gitops";
import { Patch, k8sPatch, k8sUpdate } from "@openshift-console/dynamic-plugin-sdk";
import { RolloutKind, RolloutModel } from "@rollout-model/RolloutModel";

//const proxyPath = "/api/proxy/plugin/gitops-admin-plugin/proxy";

export const restartRollout = async (rollout: RolloutKind): Promise<RolloutKind> => {
    const now = new Date().toISOString();

    return k8sPatch({
        model: RolloutModel,
        resource: rollout,
        data: [{
            op: 'replace',
            path: '/spec/restartAt',
            value: now
        }]
    })
}


export const rollbackRollout = async (rollout: RolloutKind, rs: any): Promise<RolloutKind> => {

    return k8sPatch({
        model: RolloutModel,
        resource: rollout,
        data: [{
            op: 'replace',
            path: '/spec/template',
            value: rs.spec.template
        }]
    })
}

export const promoteRollout = async (rollout: RolloutKind, promoteFull: boolean): Promise<RolloutKind> => {

    const patch: Patch[] = [];
    if (promoteFull) {
        patch.push({
            op: 'add',
            path: '/status/promoteFull',
            value: true
        })
    }
    patch.push({
        op: 'replace',
        path: '/status/pauseConditions',
        value: null
    })

    return k8sPatch({
        model: RolloutModel,
        resource: rollout,
        data: patch,
        path: "status"
    })
}

export const syncResourcek8s = async (app: ApplicationKind, resources: ApplicationResourceStatus[]): Promise<ApplicationKind> => {

    var syncResources: Resource[] = [];
    resources.forEach(item => {
        const res: Resource = { name: item.name, kind: item.kind, group: item.group, namespace: item.namespace }
        syncResources.push(res);
    });

    return syncAppK8s(app, syncResources);
}

// export const syncResource = async (app: ApplicationKind, resource: ApplicationResourceStatus): Promise<boolean> => {

//     const response = await consoleFetchJSON(proxyPath + "/api/v1/applications/" + app.metadata.name + "/sync", 'POST', {
//         method: 'POST',
//         headers: {
//             'content-type': 'application/json;charset=UTF-8',
//             'Accept': 'application/json',
//             'namespace': app.metadata.namespace
//         },
//         body: JSON.stringify(
//             {
//                 resources: [
//                     {
//                         group: resource.group,
//                         kind: resource.kind,
//                         name: resource.name,
//                         namespace: resource.namespace
//                     }
//                 ]
//             }
//         )
//     });

//     // TODO - Look Ma, no error handling or logging
//     return (response.status == 200);
// }

/*
 * Synchronizes the application using k8s only, bypasses Argo CD RBAC and requires
 * the user to have patch permissions on the Application object.
 */
export const syncAppK8s = async (app: ApplicationKind, resources?: Resource[]): Promise<ApplicationKind> => {
    const operation: ApplicationOperation = {
        info: [
            {
                name: "Reason",
                value: "Initated by user in openshift console"
            }
        ],
        initiatedBy: {
            automated: false,
            username: "OpenShift-Console"
        },
        sync: {}
    }

    if (app.spec.syncPolicy) {
        if (app.spec.syncPolicy.retry) operation.retry = app.spec.syncPolicy.retry;
        if (app.spec.syncPolicy.syncOptions) operation.sync.syncOptions = app.spec.syncPolicy.syncOptions;
        if (app.spec.syncPolicy.automated.prune) operation.sync.prune = app.spec.syncPolicy.automated.prune;
    }
    if (resources) {
        operation.sync.resources = resources;
    }

    app.operation = operation;

    return k8sUpdate({
        model: ApplicationModel,
        data: app,
    })
}

/*
 * Refreshes the application using the annotation bypassing the Argo CD RBAC, see SyncApp for more info
 */
export const refreshAppk8s = async (app: ApplicationKind, hard: boolean): Promise<ApplicationKind> => {
    // Note we need to add the annotations first in case it doesn't exist already


    if (!app.metadata.annotations) app.metadata.annotations = {};
    app.metadata.annotations[annotationRefreshKey] = (hard ? "hard" : "refreshing");

    return k8sUpdate({
        model: ApplicationModel,
        data: app,
    });
}

/*
 *  Syncs an app using the Argo CD REST API, this will do a token exchange of the OpenShift console
 *  token for a Dex token that works with Argo. The console proxy (https://github.com/gnunn-gitops/gitops-plugin-proxy
 *  handles the token exchange.
 *
 *  The benefit of this approach is that it respects Argo CD RBAC, the downside is that it is very
 *  dependent on Dex and knowing where Argo CD is installed along with Dex. For example using Keycloak
 *  will be challenging because it could be located anywhere and parsing out the argocd cr to figure out
 *  isn't always going to be possible (i.e. App in Any Namespaces)
 */
// export const syncApp = async (app: ApplicationKind): Promise<boolean> => {

//     const response = await consoleFetchJSON(proxyPath + "/api/v1/applications/" + app.metadata.name + "/sync", 'POST', {
//         method: 'POST',
//         headers: {
//             'content-type': 'application/json;charset=UTF-8',
//             'Accept': 'application/json',
//             'namespace': app.metadata.namespace
//         }
//     });

//     // TODO - Look Ma, no error handling or logging
//     return (response.status == 200);
// }

// export const refreshApp = async (app: ApplicationKind, hard: boolean): Promise<boolean> => {

//     const response = await consoleFetchJSON(proxyPath + "/api/v1/applications/" + app.metadata.name + "?refresh=" + (hard ? 'hard' : 'normal'), 'GET', {
//         headers: {
//             'content-type': 'application/json;charset=UTF-8',
//             'Accept': 'application/json',
//             'namespace': app.metadata.namespace
//         }
//     });

//     // TODO - Look Ma, no error handling or logging
//     return (response.status == 200);
// }
