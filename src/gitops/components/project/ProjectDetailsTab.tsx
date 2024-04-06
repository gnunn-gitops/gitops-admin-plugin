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
import { AppProjectModel } from '@gitops-models/AppProjectModel';
import { getObjectModifyPermissions } from '@gitops-utils/utils';
import StandardDetailsGroup from '@utils/components/StandardDetailsGroup/StandardDetailsGroup';
import { DetailsDescriptionGroup } from '@utils/components/DetailsDescriptionGroup/DetailsDescriptionGroup';

type ProjectDetailsTabProps = RouteComponentProps<{
  ns: string;
  name: string;
}> & {
  obj?: any;
};

const ProjectDetailsTab: React.FC<ProjectDetailsTabProps> = ({ obj }) => {
  const { t } = useGitOpsTranslation();

  const [canPatch] = getObjectModifyPermissions(obj, AppProjectModel);

  return (
    <div>
      <PageSection variant={PageSectionVariants.light}>
        <Title headingLevel="h2" className="co-section-heading">
          {t('Project details')}
        </Title>
        <Grid hasGutter={true} span={2} sm={3} md={6} lg={6} xl={6} xl2={6}>
          <GridItem>
            <DescriptionList>
              <StandardDetailsGroup
                obj={obj}
                model={AppProjectModel}
                canPatch={canPatch}
                exclude={[]}
              />
            </DescriptionList>
          </GridItem>
          <GridItem>
            <DescriptionList>

              <DetailsDescriptionGroup title={t('Description')} help={t('Description of Project.')}>
                {obj?.spec?.description}
              </DetailsDescriptionGroup>

            </DescriptionList>
          </GridItem>
        </Grid>
      </PageSection>

    </div>
  );
};

export default ProjectDetailsTab;
