import { RolloutKind } from "@rollout-model/RolloutModel";

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

export function isDeploying(ro: RolloutKind) {
    if (ro?.status?.phase) {
        return ro.status?.phase === RolloutStatus.Progressing || ro.status?.phase === RolloutStatus.Paused;
    } else {
        return false;
    }
}
