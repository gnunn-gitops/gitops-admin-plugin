import { CertificateRequestKind } from "@cr-models/CertificateRequests";

export enum ConditionReason {
	UpdateFailed         = "UpdateFailed",
	Updated              = "Updated",
    Unknown              = "Unknown"
}

export type CertificateRequestStatus = {
    reason: string
    ready: boolean
}

// TODO - This needs improvement, we iterate but is it necessary?
export function getStatus(cr: CertificateRequestKind): CertificateRequestStatus {
    let status: CertificateRequestStatus = {reason: "Unknown", ready: false}
    if (cr.status?.conditions) {
        cr.status.conditions.forEach((condition) => {
            if (condition.type == "Ready") {
                status = {reason: condition.reason ? condition.reason: "" , ready: condition.status == "True"}
                return;
            }
        })
    }
    return status;
}
