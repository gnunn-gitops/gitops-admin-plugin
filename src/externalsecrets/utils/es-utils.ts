import { ExternalSecretKind } from "@es-models/ExternalSecrets";

export enum ConditionReason {
    SecretSynced = "SecretSynced",
	// ConditionReasonSecretSyncedError indicates that there was an error syncing the secret.
	SecretSyncedError = "SecretSyncedError",
	// ConditionReasonSecretDeleted indicates that the secret has been deleted.
	SecretDeleted = "SecretDeleted",
	InvalidStoreRef      = "InvalidStoreRef",
	InvalidProviderClientConfig = "InvalidProviderClientConfig",
	UpdateFailed         = "UpdateFailed",
	Updated              = "Updated",
    Unknown              = "Unknown"
}

export type ExternalSecretStatus = {
    reason: string
    ready: boolean
}

// TODO - This needs improvement, we iterate but is it necessary?
export function getStatus(es: ExternalSecretKind): ExternalSecretStatus {
    let status: ExternalSecretStatus = {reason: "Unknown", ready: false}
    if (es.status?.conditions) {
        es.status.conditions.forEach((condition) => {
            if (condition.type == "Ready") {
                status = {reason: condition.reason ? condition.reason: "" , ready: condition.status == "True"}
                return;
            }
        })
    }
    return status;
}

export function getTargetSecretName(es: ExternalSecretKind):string {
    return es.spec.target?.name ? es.spec.target.name : es.metadata.name;
}
