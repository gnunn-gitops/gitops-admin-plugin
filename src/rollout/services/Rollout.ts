import { Patch, k8sPatch } from "@openshift-console/dynamic-plugin-sdk"
import { RolloutKind, RolloutModel } from "@rollout-models/RolloutModel"

export const retryRollout = async (rollout: RolloutKind): Promise<RolloutKind> => {
    return k8sPatch({
        model: RolloutModel,
        resource: rollout,
        data: [{
            op: 'add',
            path: '/status/abort',
            value: false
        }],
        path: "status"
    })
}

export const abortRollout = async (rollout: RolloutKind): Promise<RolloutKind> => {
    return k8sPatch({
        model: RolloutModel,
        resource: rollout,
        data: [{
            op: 'add',
            path: '/status/abort',
            value: true
        }],
        path: "status"
    })
}

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
