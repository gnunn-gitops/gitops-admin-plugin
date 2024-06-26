import * as React from 'react';

import { RolloutKind } from "@rollout-models/RolloutModel";
import { useGitOpsTranslation } from '@utils/hooks/useGitOpsTranslation';
import { ResourceLink } from '@openshift-console/dynamic-plugin-sdk';
import { DetailsDescriptionGroup } from '@utils/components/DetailsDescriptionGroup/DetailsDescriptionGroup';

type BlueGreenServicesProps = {
    rollout: RolloutKind;
}

const BlueGreenServices: React.FC<BlueGreenServicesProps> = ({ rollout }) => {
    const { t } = useGitOpsTranslation();

    return (
        <>
            <DetailsDescriptionGroup title={t("Active")} help={t("The active bluegreen service")}>
                {rollout.spec.strategy.blueGreen.activeService ?
                    <ResourceLink groupVersionKind={{ version: "v1", kind: "Service" }} name={rollout.spec.strategy.blueGreen.activeService} namespace={rollout.metadata.namespace}/>
                :
                    "-"
                }
            </DetailsDescriptionGroup>

            <DetailsDescriptionGroup title={t('Preview')} help={t('The preview bluegreen service')}>
                {rollout.spec.strategy.blueGreen.previewService ?
                    <ResourceLink groupVersionKind={{ version: "v1", kind: "Service" }} name={rollout.spec.strategy.blueGreen.previewService} namespace={rollout.metadata.namespace}/>
                :
                    "-"
                }
            </DetailsDescriptionGroup>
        </>
    )
}

export default BlueGreenServices;
