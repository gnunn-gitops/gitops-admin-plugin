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
  GhostIcon
} from '@patternfly/react-icons';
import { global_danger_color_100 as dangerColor } from '@patternfly/react-tokens/dist/js/global_danger_color_100';
import { global_default_color_200 as blueDefaultColor } from '@patternfly/react-tokens/dist/js/global_default_color_200';
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
    <CircleNotchIcon color={disabledColor.value} className={className} title={title} />
);

export const HealthUnknownIcon: React.FC<ColoredIconProps> = ({ className, title }) => (
    <UnknownIcon color={disabledColor.value} className={className} title={title} />
  );

export const HealthProgressingIcon: React.FC<ColoredIconProps> = ({ className, title }) => (
    <CircleNotchIcon color={blueDefaultColor.value} className={className} title={title} />
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
