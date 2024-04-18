import { ExternalSecretKind } from "@es-models/ExternalSecrets";

export enum ConditionReason {
    ConditionReasonSecretSynced = "SecretSynced",
	// ConditionReasonSecretSyncedError indicates that there was an error syncing the secret.
	ConditionReasonSecretSyncedError = "SecretSyncedError",
	// ConditionReasonSecretDeleted indicates that the secret has been deleted.
	ConditionReasonSecretDeleted = "SecretDeleted",
	ReasonInvalidStoreRef      = "InvalidStoreRef",
	ReasonProviderClientConfig = "InvalidProviderClientConfig",
	ReasonUpdateFailed         = "UpdateFailed",
	ReasonUpdated              = "Updated",
}

export enum ExternalSecretStatusCode {
    SYNCED = "Synced",
    UPDATED = "Updated",
    NOT_SYNCED = "Not Synced",
    SYNC_ERROR = "Sync Error",
    SECRET_DELETED = "Secret Deleted",
    INVALID_STORE = "Invalid Store",
    INVALID_PROVIDER_CONFIG = "Invalid Provider Config",
    UPDATE_FAILED = "Update Failed",
    UNKNOWN = "Unknown"
}

export enum ExternalSecretStatusSeverity {
    HEALTHY = 0,
    ERROR = 1,
    WARNING = 2
}

export type ExternalSecretStatus = {
    code: ExternalSecretStatusCode
    severity: ExternalSecretStatusSeverity
    msg?: string
}

// TODO - This needs improvement, we iterate but is it necessary?
export function getStatus(es: ExternalSecretKind): ExternalSecretStatus {
    let status: ExternalSecretStatus = {code: ExternalSecretStatusCode.UNKNOWN, severity: ExternalSecretStatusSeverity.WARNING}
    if (es.status?.conditions) {
        es.status.conditions.forEach((condition) => {
            switch (condition.reason) {
                case ConditionReason.ConditionReasonSecretSynced:
                    if (condition.status == "True") {
                        status = {code: ExternalSecretStatusCode.SYNCED, severity: ExternalSecretStatusSeverity.HEALTHY}
                    } else {
                        status = {code: ExternalSecretStatusCode.NOT_SYNCED, severity: ExternalSecretStatusSeverity.WARNING, msg: condition.message}
                    }
                    break;
                case (ConditionReason.ConditionReasonSecretSyncedError):
                    status = {code: ExternalSecretStatusCode.SYNC_ERROR, severity: ExternalSecretStatusSeverity.ERROR, msg: condition.message};
                    break;
                case (ConditionReason.ConditionReasonSecretDeleted):
                    status = {code: ExternalSecretStatusCode.SECRET_DELETED, severity: ExternalSecretStatusSeverity.WARNING, msg: condition.message};
                    break;
                case (ConditionReason.ReasonInvalidStoreRef):
                    status = {code: ExternalSecretStatusCode.INVALID_STORE, severity: ExternalSecretStatusSeverity.ERROR, msg: condition.message};
                    break;
                case (ConditionReason.ReasonUpdateFailed):
                    status = {code: ExternalSecretStatusCode.UPDATE_FAILED, severity: ExternalSecretStatusSeverity.ERROR, msg: condition.message};
                    break;
                case (ConditionReason.ReasonUpdated):
                    status = {code: ExternalSecretStatusCode.UPDATED, severity: ExternalSecretStatusSeverity.HEALTHY};
                    break;
                case (ConditionReason.ReasonProviderClientConfig):
                    status = {code: ExternalSecretStatusCode.INVALID_PROVIDER_CONFIG, severity: ExternalSecretStatusSeverity.ERROR, msg: condition.message};
                    break;
                default:
                    status = {code: ExternalSecretStatusCode.UNKNOWN, severity: ExternalSecretStatusSeverity.WARNING, msg: "Unknown condition reason"};
            }
        })
    }
    return status;
}
