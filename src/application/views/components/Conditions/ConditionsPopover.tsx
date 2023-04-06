import React from 'react';
import { Label, Popover } from '@patternfly/react-core';
import { RedExclamationCircleIcon, StatusPopupItem, StatusPopupSection } from '@openshift-console/dynamic-plugin-sdk';

import { ApplicationCondition } from '@application-model/ApplicationModel';


interface ConditionsPopoverProps {
    conditions: ApplicationCondition[];
}

export const ConditionsPopover: React.FC<ConditionsPopoverProps> = ({ conditions }) => (
    <Popover
      hasAutoWidth={true}
      headerContent={<div>Application Conditions</div>}
      bodyContent={
        <div>
            <div className="pf-u-pt-sm pf-u-pb-md">
                A list of currently observed application conditions
            </div>

        <StatusPopupSection
            firstColumn={
            <>
                <span>Message</span>
            </>
            }
            secondColumn='Error'
        >
            {conditions.map(condition => (<StatusPopupItem value={condition.type}><span>{condition.message}</span></StatusPopupItem>))}
        </StatusPopupSection>
        </div>
      }
    >
    <Label color="red" icon={<RedExclamationCircleIcon />}>
        {conditions.length == 1 ? "1 Error" : conditions.length + " Errors"}
    </Label>
    </Popover>
);
