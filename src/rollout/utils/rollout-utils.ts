export enum RolloutStatus {
    Progressing = 'Progressing',
    Degraded = 'Degraded',
    Paused = 'Paused',
    Healthy = 'Healthy',
}

export enum AnalysisRunStatus {
    Successful = 'Successful',
    Inconclusive = 'Inconclusive',
    Failed = 'Failed',
    Error = 'Error',
    Pending = 'Pending',
    Running = 'Running'
}