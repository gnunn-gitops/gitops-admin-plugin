export const DEFAULT_NAMESPACE = 'default';

export enum SyncStatus {
    SYNCED = "Synced",
    OUT_OF_SYNC = "OutOfSync",
    UNKNOWN = "Unknown"
}

export enum HealthStatus {
    HEALTHY = "Healthy",
    DEGRADED = "Degraded",
    SUSPENDED = "Suspended",
    MISSING = "Missing",
    PROGRESSING = "Progressing",
    UNKNOWN = "Unknown"
}

export enum PhaseStatus {
    TERMINATING = 'Terminating',
    RUNNING = 'Running',
    SUCCEEDED = 'Succeeded',
    FAILED = 'Failed',
    ERROR = 'Error'
}
