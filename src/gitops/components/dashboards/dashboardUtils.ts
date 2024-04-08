export { ApplicationModel } from '@gitops-models/ApplicationModel';
export { ApplicationSetModel } from '@gitops-models/ApplicationSetModel';

// Supports OpenShift Console Dashboard inventory plugin
export enum InventoryStatusGroup {
    WARN = "WARN",
    ERROR = "ERROR",
    PROGRESS = "PROGRESS",
    NOT_MAPPED = "NOT_MAPPED",
    UNKNOWN = "UNKNOWN"
}
