import { CertificateKind } from "@cert-models/Certificates";

export enum ConditionReason {
	UpdateFailed         = "UpdateFailed",
	Updated              = "Updated",
    Unknown              = "Unknown"
}

export type CertificateStatus = {
    reason: string
    ready: boolean
}

// TODO - This needs improvement, we iterate but is it necessary?
export function getStatus(cert: CertificateKind): CertificateStatus {
    let status: CertificateStatus = {reason: "Unknown", ready: false}
    if (cert.status?.conditions) {
        cert.status.conditions.forEach((condition) => {
            if (condition.type == "Ready") {
                status = {reason: condition.reason ? condition.reason: "" , ready: condition.status == "True"}
                return;
            }
        })
    }
    return status;
}

