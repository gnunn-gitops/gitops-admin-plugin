import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import {
    DescriptionList,
    Grid,
    GridItem,
    PageSection,
    PageSectionVariants,
    Title
} from '@patternfly/react-core';
import { useGitOpsTranslation } from '@utils/hooks/useGitOpsTranslation';
import { ExternalSecretKind, ExternalSecretModel } from '@es-models/ExternalSecrets';
import { getObjectModifyPermissions } from '@gitops-utils/utils';
import StandardDetailsGroup from '@utils/components/StandardDetailsGroup/StandardDetailsGroup';
import { DetailsDescriptionGroup } from '@utils/components/DetailsDescriptionGroup/DetailsDescriptionGroup';
import ESStatus from './ESStatus';
import { Conditions } from '@utils/components/Conditions/conditions';
import { K8sGroupVersionKind, ResourceLink } from '@openshift-console/dynamic-plugin-sdk';
import { getTargetSecretName } from '../utils/es-utils';

type ESDetailsTabProps = RouteComponentProps<{
    ns: string;
    name: string;
}> & {
    obj?: ExternalSecretKind;
};

const ESDetailsTab: React.FC<ESDetailsTabProps> = ({ obj }) => {
    const { t } = useGitOpsTranslation();

    const gvk: K8sGroupVersionKind = {
        version: "v1beta1",
        group: "external-secrets.io",
        kind: obj.spec.secretStoreRef.kind ? obj.spec.secretStoreRef.kind : "SecretStore"
    }

    const [canPatch] = getObjectModifyPermissions(obj, ExternalSecretModel);

    return (
        <div>
            <PageSection variant={PageSectionVariants.light}>
                <Title headingLevel="h2" className="co-section-heading">
                    {t('ExternalSecret details')}
                </Title>
                <Grid hasGutter={true} span={2} sm={3} md={6} lg={6} xl={6} xl2={6}>
                    <GridItem>
                        <DescriptionList className="pf-c-description-list pf-v5-u-mr-md">
                            <StandardDetailsGroup
                                obj={obj}
                                model={ExternalSecretModel}
                                canPatch={canPatch}
                                exclude={[]}
                            />
                        </DescriptionList>
                    </GridItem>
                    <GridItem>
                        <DescriptionList className="pf-c-description-list">

                            <DetailsDescriptionGroup title={t('Status')} help={t('Status of ExternalSecret.')}>
                                <ESStatus externalSecret={obj} />
                            </DetailsDescriptionGroup>

                            <DetailsDescriptionGroup title={t('Secret Store')} help={t('Secret Store to retrieve secret from..')}>
                                <ResourceLink
                                    groupVersionKind={gvk}
                                    name={obj.spec.secretStoreRef.name}
                                    namespace={gvk.kind == "SecretStore" ? obj.metadata.namespace : null}
                                />
                            </DetailsDescriptionGroup>

                            <DetailsDescriptionGroup title={t('Target Secret')} help={t('Target secret where secret is generated')}>
                                <ResourceLink
                                    groupVersionKind={{version: "v1", group: "", kind: "Secret"}}
                                    name={getTargetSecretName(obj)}
                                    namespace={obj.metadata.namespace}
                                />
                            </DetailsDescriptionGroup>

                        </DescriptionList>
                    </GridItem>
                </Grid>
            </PageSection>
            <PageSection variant={PageSectionVariants.light} hasShadowTop={true}>
                <Title headingLevel="h2" className="co-section-heading">
                    {t('Conditions')}
                </Title>
                {obj.status?.conditions ?
                    <Conditions conditions={obj.status.conditions} />
                    :
                    <><span className='pf-u-text-align-center'>No Conditions</span></>
                }
            </PageSection>
        </div>
    );
};

export default ESDetailsTab;
