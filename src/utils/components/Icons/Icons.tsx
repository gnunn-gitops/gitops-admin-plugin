import * as React from 'react';

import { ColoredIconProps } from '@openshift-console/dynamic-plugin-sdk';
import {
  ArrowCircleUpIcon,
  ResourcesAlmostFullIcon,
  ResourcesFullIcon,
  SyncAltIcon,
  UnknownIcon,
  CircleNotchIcon,
  OutlinedPauseCircleIcon,
  HeartIcon,
  HeartBrokenIcon,
  GhostIcon,
  BanIcon,
  ExclamationCircleIcon,
  PausedIcon,
  CheckIcon,
  MonitoringIcon,
  PendingIcon
} from '@patternfly/react-icons';
import { global_danger_color_100 as dangerColor } from '@patternfly/react-tokens/dist/js/global_danger_color_100';
import { global_primary_color_200 as blueDefaultColor } from '@patternfly/react-tokens/dist/js/global_primary_color_200';
import { global_disabled_color_100 as disabledColor } from '@patternfly/react-tokens/dist/js/global_disabled_color_100';
import { global_palette_blue_300 as blueInfoColor } from '@patternfly/react-tokens/dist/js/global_palette_blue_300';
import { global_warning_color_100 as warningColor } from '@patternfly/react-tokens/dist/js/global_warning_color_100';
import { global_success_color_100 as successColor } from '@patternfly/react-tokens/dist/js/global_success_color_100';

export {
  BlueInfoCircleIcon,
  ColoredIconProps,
  GreenCheckCircleIcon,
  RedExclamationCircleIcon,
  YellowExclamationTriangleIcon,
} from '@openshift-console/dynamic-plugin-sdk';

export const BlueSyncIcon: React.FC<ColoredIconProps> = ({ className, title }) => (
  <SyncAltIcon color={blueInfoColor.value} className={className} title={title} />
);

export const RedResourcesFullIcon: React.FC<ColoredIconProps> = ({ className, title }) => (
  <ResourcesFullIcon color={dangerColor.value} className={className} title={title} />
);

export const YellowResourcesAlmostFullIcon: React.FC<ColoredIconProps> = ({ className, title }) => (
  <ResourcesAlmostFullIcon color={warningColor.value} className={className} title={title} />
);

export const BlueArrowCircleUpIcon: React.FC<ColoredIconProps> = ({ className, title }) => (
  <ArrowCircleUpIcon color={blueDefaultColor.value} className={className} title={title} />
);

export const OutOfSyncIcon: React.FC<ColoredIconProps> = ({ className, title }) => (
    <ArrowCircleUpIcon color={warningColor.value} className={className} title={title} />
);

export const SyncUnknownIcon: React.FC<ColoredIconProps> = ({ className, title }) => (
    <CircleNotchIcon color={disabledColor.value} className={className + " fa-spin"} title={title} />
);

export const HealthUnknownIcon: React.FC<ColoredIconProps> = ({ className, title }) => (
    <UnknownIcon color={disabledColor.value} className={className} title={title} />
  );

export const HealthProgressingIcon: React.FC<ColoredIconProps> = ({ className, title }) => (
    <CircleNotchIcon color={blueDefaultColor.value} className={className + " fa-spin"} title={title} />
);

export const HealthSuspendedIcon: React.FC<ColoredIconProps> = ({ className, title }) => (
    <OutlinedPauseCircleIcon color={disabledColor.value} className={className} title={title} />
);

export const HealthHealthyIcon: React.FC<ColoredIconProps> = ({ className, title }) => (
    <HeartIcon color={successColor.value} className={className} title={title} />
);

export const HealthDegradedIcon: React.FC<ColoredIconProps> = ({ className, title }) => (
    <HeartBrokenIcon color={dangerColor.value} className={className} title={title} />
);

export const HealthMissingIcon: React.FC<ColoredIconProps> = ({ className, title }) => (
    <GhostIcon color={warningColor.value} className={className} title={title} />
);

export const PhaseErrorIcon: React.FC<ColoredIconProps> = ({ className, title }) => (
  <ExclamationCircleIcon color={dangerColor.value} className={className} title={title} />
);

export const SyncFailedIcon = PhaseErrorIcon;

export const PhaseFailedIcon = PhaseErrorIcon;
export const PhaseRunningIcon = HealthProgressingIcon;
export const PhaseSucceededIcon = HealthHealthyIcon;
export const PhaseTerminatingIcon: React.FC<ColoredIconProps> = ({ className, title }) => (
  <BanIcon color={disabledColor.value} className={className} title={title} />
);

export const RolloutStatusProgressingIcon = HealthProgressingIcon;
export const RolloutStatusDegradedIcon = HealthDegradedIcon;
export const RolloutStatusHealthyIcon = HealthHealthyIcon;
export const RolloutStatusPausedIcon: React.FC<ColoredIconProps> = ({ className, title }) => (
  <PausedIcon color={blueDefaultColor.value} className={className} title={title} />
);
// Should never see this one but if rollouts introduces a new status before this is updated good to show something
export const RolloutStatusUnknownIcon = SyncUnknownIcon;

export const AnalysisRunStatusSuccessfulIcon: React.FC<ColoredIconProps> = ({ className, title }) => (
  <CheckIcon color={successColor.value} className={className} title={title} />
);
export const AnalysisRunStatusFailureIcon = HealthDegradedIcon;
export const AnalysisRunStatusErrorIcon = HealthDegradedIcon;
export const AnalysisRunInconclusiveErrorIcon = SyncUnknownIcon;
export const AnalysisRunStatusUnknownIcon = SyncUnknownIcon;
export const AnalysisRunStatusRunningIcon = HealthProgressingIcon;
export const AnalysisRunStatusPendingIcon: React.FC<ColoredIconProps> = ({ className, title }) => (
  <PendingIcon color={blueDefaultColor.value} className={className} title={title} />
);

export const MeasurementSuccessfulIcon: React.FC<ColoredIconProps> = ({ className, title }) => (
  <MonitoringIcon color={successColor.value} className={className} title={title} />
);

export const MeasurementFailedIcon: React.FC<ColoredIconProps> = ({ className, title }) => (
  <MonitoringIcon color={dangerColor.value} className={className} title={title} />
);
