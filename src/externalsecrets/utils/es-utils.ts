export enum ConditionReason {
    ConditionReasonSecretSynced = "SecretSynced",
	// ConditionReasonSecretSyncedError indicates that there was an error syncing the secret.
	ConditionReasonSecretSyncedError = "SecretSyncedError",
	// ConditionReasonSecretDeleted indicates that the secret has been deleted.
	ConditionReasonSecretDeleted = "SecretDeleted",
	ReasonInvalidStoreRef      = "InvalidStoreRef",
	ReasonProviderClientConfig = "InvalidProviderClientConfig",
	ReasonUpdateFailed         = "UpdateFailed",
	ReasonUpdated              = "Updated"
}
