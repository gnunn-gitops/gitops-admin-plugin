import * as React from 'react';

import { RolloutKind } from "@rollout-models/RolloutModel";
import { useGitOpsTranslation } from '@utils/hooks/useGitOpsTranslation';
import { ResourceLink } from '@openshift-console/dynamic-plugin-sdk';
import { DetailsDescriptionGroup } from '@utils/components/DetailsDescriptionGroup/DetailsDescriptionGroup';

type CanaryServicesProps = {
    rollout: RolloutKind;
}

const CanaryServices: React.FC<CanaryServicesProps> = ({ rollout }) => {
    const { t } = useGitOpsTranslation();

    return (
        <>
            <DetailsDescriptionGroup title={t('Stable')} help={t('The stable service')}>
                {rollout.spec.strategy.canary.stableService ?
                    <ResourceLink groupVersionKind={{ version: "v1", kind: "Service" }} name={rollout.spec.strategy.canary.stableService} namespace={rollout.metadata.namespace} />
                :
                    "-"
                }
            </DetailsDescriptionGroup>

            <DetailsDescriptionGroup title={t('Canary')} help={t('The canary service')}>
                {rollout.spec.strategy.canary.canaryService ?
                    <ResourceLink groupVersionKind={{ version: "v1", kind: "Service" }} name={rollout.spec.strategy.canary.canaryService} namespace={rollout.metadata.namespace} />
                :
                    "-"
                }
            </DetailsDescriptionGroup>
        </>
    )
}

export default CanaryServices;
