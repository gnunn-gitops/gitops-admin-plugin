import { ApplicationKind, ApplicationModel, ApplicationOperation, ApplicationResourceStatus, Resource } from "@gitops-models/ApplicationModel";
import { annotationRefreshKey } from "@gitops-utils/gitops";
import { k8sPatch, k8sUpdate } from "@openshift-console/dynamic-plugin-sdk";

export const syncResourcek8s = async (app: ApplicationKind, resources: ApplicationResourceStatus[]): Promise<ApplicationKind> => {

    var syncResources: Resource[] = [];
    resources.forEach(item => {
        const res: Resource = { name: item.name, kind: item.kind, group: item.group, namespace: item.namespace }
        syncResources.push(res);
    });

    return syncAppK8s(app, syncResources);
}

/*
 * Synchronizes the application using k8s only, bypasses Argo CD RBAC and requires
 * the user to have patch permissions on the Application object.
 */
export const syncAppK8s = async (app: ApplicationKind, resources?: Resource[]): Promise<ApplicationKind> => {
    const operation: ApplicationOperation = {
        info: [
            {
                name: "Reason",
                value: "Initiated by user in openshift console"
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

export const terminateOpK8s = async(app: ApplicationKind): Promise<ApplicationKind> => {
    return k8sPatch({
        model: ApplicationModel,
        resource: app,
        data: [{
            op: "replace",
            path: '/status/operationState/phase',
            value: 'Terminating',
        }]
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
