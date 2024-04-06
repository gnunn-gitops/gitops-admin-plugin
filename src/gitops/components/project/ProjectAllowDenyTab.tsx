import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import {
    Card,
    CardHeader,
    CardBody,
    Grid,
    GridItem,
    List,
    ListItem,
    Panel,
    PageSection,
    PageSectionVariants,
    Title
} from '@patternfly/react-core';
import { useGitOpsTranslation } from '@utils/hooks/useGitOpsTranslation';
import { AppProjectKind } from '@gitops-models/AppProjectModel';
import DestinationsList from './DestinationsList';
import ResourceAllowDenyList from './ResourceAllowDenyList';
// import DestinationsList from './DestinationsList';
// import ResourceAllowDenyList from './ResourceAllowDenyList';

function renderStringArray(items: string[]) {
    if (items) {
        return (
            <List isPlain className="pf-u-mt-sm">
                {items.map(el => <ListItem>{el}</ListItem>)}
            </List>
        )
    } else {
        return (
            <div className="pf-u-text-align-center pf-u-mt-sm">Not found</div>
        )
    }
}

type ProjectAllowDenyTabProps = RouteComponentProps<{
    ns: string;
    name: string;
}> & {
    obj?: AppProjectKind;
};

const ProjectAllowDenyTab: React.FC<ProjectAllowDenyTabProps> = ({ obj }) => {
    const { t } = useGitOpsTranslation();

    const pageSectionStyle = PageSectionVariants.light;

    return (
        <>
            <PageSection variant={pageSectionStyle} hasShadowTop={true}>
                <Title headingLevel="h2" className="co-section-heading">
                    {t('Allowed Sources')}
                </Title>
                <Panel className="pf-v5-u-background-color-200 pf-v5-u-p-md">
                    <Grid hasGutter span={2} sm={3} md={6} lg={6} xl={6} xl2={6}>
                        <GridItem>
                            <Card isFlat isCompact className='pf-v5-u-h-100'>
                                <CardHeader>
                                    <Title headingLevel="h5">{t('Repositories')}</Title>
                                </CardHeader>
                                <CardBody>{renderStringArray(obj.spec.sourceRepos)}</CardBody>
                            </Card>
                        </GridItem>
                        <GridItem>
                            <Card isFlat isCompact className='pf-v5-u-h-100'>
                                <CardHeader>
                                    <Title headingLevel="h5">{t('Namespaces')}</Title>
                                </CardHeader>
                                <CardBody>{renderStringArray(obj.spec.sourceNamespaces)}</CardBody>
                            </Card>
                        </GridItem>
                    </Grid>
                </Panel>
            </PageSection>
            <PageSection variant={pageSectionStyle} hasShadowTop={true}>
                <Title headingLevel="h2" className="co-section-heading">
                    {t('Allowed Destinations')}
                </Title>

                <Panel className="pf-v5-u-background-color-200 pf-v5-u-p-md">
                    <Grid hasGutter>
                        <GridItem>
                            <Card isFlat isCompact className='pf-v5-u-h-100'>
                                <CardBody>
                                    <DestinationsList destinations={obj.spec.destinations} />
                                </CardBody>
                            </Card>
                        </GridItem>
                    </Grid>
                </Panel>
            </PageSection>

            <PageSection hasShadowTop={true} variant={pageSectionStyle} >
                <Title headingLevel="h2" className="co-section-heading">
                    {t('Resource Allow/Deny Lists')}
                </Title>
                <Panel className="pf-v5-u-background-color-200 pf-v5-u-p-md">
                    <Grid hasGutter span={2} sm={3} md={6} lg={6} xl={6} xl2={6}>
                        <GridItem>
                            <Card isFlat isCompact className='pf-v5-u-h-100'>
                                <CardHeader>
                                    <Title headingLevel="h5">{t('Cluster Resource Allow List')}</Title>
                                </CardHeader>
                                <CardBody>
                                    <ResourceAllowDenyList list={obj.spec.clusterResourceWhitelist} />
                                </CardBody>
                            </Card>
                        </GridItem>
                        <GridItem>
                            <Card isFlat isCompact className='pf-v5-u-h-100'>
                                <CardHeader>
                                    <Title headingLevel="h5">{t('Cluster Resource Deny List')}</Title>
                                </CardHeader>
                                <CardBody>
                                    <ResourceAllowDenyList list={obj.spec.clusterResourceBlacklist} />
                                </CardBody>
                            </Card>
                        </GridItem>
                        <GridItem>
                            <Card isFlat isCompact className='pf-v5-u-h-100'>
                                <CardHeader>
                                    <Title headingLevel="h5">{t('Namespace Resource Allow List')}</Title>
                                </CardHeader>
                                <CardBody>
                                    <ResourceAllowDenyList list={obj.spec.namespaceResourceWhitelist} />
                                </CardBody>
                            </Card>
                        </GridItem>
                        <GridItem>
                            <Card isFlat isCompact className='pf-v5-u-h-100'>
                                <CardHeader>
                                    <Title headingLevel="h5">{t('Namespace Resource Deny List')}</Title>
                                </CardHeader>
                                <CardBody>
                                    <ResourceAllowDenyList list={obj.spec.namespaceResourceBlacklist} />
                                </CardBody>
                            </Card>
                        </GridItem>
                    </Grid>
                </Panel>
            </PageSection>
        </>
    )
}

export default ProjectAllowDenyTab;
