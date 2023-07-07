import * as React from 'react';

import { RolloutKind } from "@rollout-model/RolloutModel";
import { useGitOpsTranslation } from '@gitops-utils/hooks/useGitOpsTranslation';
import { ResourceLink } from '@openshift-console/dynamic-plugin-sdk';
import { DetailsDescriptionGroup } from '@shared/views/components/DetailsDescriptionGroup/DetailsDescriptionGroup';

type BlueGreenServicesProps = {
    rollout: RolloutKind;
}

const BlueGreenServices: React.FC<BlueGreenServicesProps> = ({ rollout }) => {
    const { t } = useGitOpsTranslation();

    return (
        <>
            <DetailsDescriptionGroup title={t("Active")} help={t("The active bluegreen service")}>
                <ResourceLink groupVersionKind={{ version: "v1", kind: "Service" }} name={rollout.spec.strategy.blueGreen.activeService} namespace={rollout.metadata.namespace}/>
            </DetailsDescriptionGroup>

            <DetailsDescriptionGroup title={t('Preview')} help={t('The preview bluegreen service')}>
                <ResourceLink groupVersionKind={{ version: "v1", kind: "Service" }} name={rollout.spec.strategy.blueGreen.previewService} namespace={rollout.metadata.namespace}/>
            </DetailsDescriptionGroup>
        </>
    )
}

export default BlueGreenServices;