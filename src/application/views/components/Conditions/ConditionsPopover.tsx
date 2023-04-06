import React from 'react';
import { Label, Popover } from '@patternfly/react-core';
import { BlueInfoCircleIcon, RedExclamationCircleIcon, StatusPopupItem, StatusPopupSection, YellowExclamationTriangleIcon } from '@openshift-console/dynamic-plugin-sdk';

import { ApplicationCondition } from '@application-model/ApplicationModel';


interface ConditionsPopoverProps {
    conditions: ApplicationCondition[];
}

export const ConditionsPopover: React.FC<ConditionsPopoverProps> = ({ conditions }) => {

    const summary:ConditionSummary = getConditionsSummary(conditions);

    return (
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
                {conditions.map(condition => (<StatusPopupItem value={condition.type}><span className="pf-u-pr-md">{condition.message}</span></StatusPopupItem>))}
            </StatusPopupSection>
            </div>
        }
        >
        <Label color="grey" >
            {summary.error > 0 &&
                <div>
                    <RedExclamationCircleIcon/><span className="pf-u-pl-sm">{(summary.error == 1 ? "1 Error" : summary.error + " Errors")}</span>
                </div>
            }
            {summary.warning > 0 &&
                <div className={summary.error > 0 ? "pf-u-pl-sm": ""}>
                    <YellowExclamationTriangleIcon/><span className="pf-u-pl-sm">{(summary.warning == 1 ? "1 Warning" : summary.warning + " Warnings")}</span>
                </div>
            }
            {summary.info > 0 &&
                <div className={summary.error > 0 || summary.warning > 0 ? "pf-u-pl-sm": ""}>
                    <BlueInfoCircleIcon/><span className="pf-u-pl-sm">{(summary.info == 1 ? "1 Notice" : summary.info + " Notices")}</span>
                </div>
            }
        </Label>
        </Popover>
    )
};

type ConditionSummary = {
    error: number,
    warning: number,
    info: number
}

function getConditionsSummary(conditions:ApplicationCondition[]): ConditionSummary {

    var summary: ConditionSummary = {
        error: 0,
        warning: 0,
        info: 0
    };

    conditions.map(condition => {

        if (condition.type.endsWith("Error")) summary.error++
        else if (condition.type.endsWith("Warn")) summary.warning++
        else summary.info++;
    });

    return summary;
}
