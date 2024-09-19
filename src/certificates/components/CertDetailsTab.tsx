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
import { CertificateKind, CertificateModel } from '@cert-models/Certificates';
import { getObjectModifyPermissions } from '@gitops-utils/utils';
import StandardDetailsGroup from '@utils/components/StandardDetailsGroup/StandardDetailsGroup';
import { DetailsDescriptionGroup } from '@utils/components/DetailsDescriptionGroup/DetailsDescriptionGroup';
import CertStatus from './CertStatus';
import { Conditions } from '@utils/components/Conditions/conditions';

type CertDetailsTabProps = RouteComponentProps<{
    ns: string;
    name: string;
}> & {
    obj?: CertificateKind;
};

const CertDetailsTab: React.FC<CertDetailsTabProps> = ({ obj }) => {
    const { t } = useGitOpsTranslation();



    const [canPatch] = getObjectModifyPermissions(obj, CertificateModel);

    return (
        <div>
            <PageSection variant={PageSectionVariants.light}>
                <Title headingLevel="h2" className="co-section-heading">
                    {t('Certificate details')}
                </Title>
                <Grid hasGutter={true} span={2} sm={3} md={6} lg={6} xl={6} xl2={6}>
                    <GridItem>
                        <DescriptionList className="pf-c-description-list pf-v5-u-mr-md">
                            <StandardDetailsGroup
                                obj={obj}
                                model={CertificateModel}
                                canPatch={canPatch}
                                exclude={[]}
                            />
                        </DescriptionList>
                    </GridItem>
                    <GridItem>
                        <DescriptionList className="pf-c-description-list">

                            <DetailsDescriptionGroup title={t('Status')} help={t('Status of Certificate.')}>
                                <CertStatus certificate={obj} />
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

export default CertDetailsTab;
