import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import {
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTermHelpText,
  DescriptionListTermHelpTextButton,
  Grid,
  GridItem,
  PageSection,
  Popover,
  Title
} from '@patternfly/react-core';
import { useGitOpsTranslation } from '@gitops-utils/hooks/useGitOpsTranslation';
import { getObjectModifyPermissions } from '@gitops-utils/utils';
import StandardDetailsGroup from '@shared/views/components/StandardDetailsGroup/StandardDetailsGroup';
import { RolloutModel } from '@rollout-model/RolloutModel';
import BlueGreenServices from './components/services/BlueGreenServices';
import CanaryServices from './components/services/CanaryServices';

type RolloutDetailsPageProps = RouteComponentProps<{
  ns: string;
  name: string;
}> & {
  obj?: any;
};

const RolloutDetailsPage: React.FC<RolloutDetailsPageProps> = ({ obj }) => {
  const { t } = useGitOpsTranslation();

  console.log(obj);

  const [canPatch] = getObjectModifyPermissions(obj, RolloutModel);

  return (
    <div>
      <PageSection>
        <Title headingLevel="h2" className="co-section-heading">
          {t('Rollout details')}
        </Title>
        <Grid hasGutter={true} span={2} sm={3} md={6} lg={6} xl={6} xl2={6}>
          <GridItem>
            <DescriptionList>
              <StandardDetailsGroup
                obj={obj}
                model={RolloutModel}
                canPatch={canPatch}
                exclude={[]}
              />
            </DescriptionList>
          </GridItem>
          <GridItem>
            <DescriptionList>
              <DescriptionListGroup>
                <DescriptionListTermHelpText>
                  <Popover headerContent={<div>{t('Strategy')}</div>} bodyContent={<div>{t('Whether the rollout is using a blue-green or canary strategy')}</div>}>
                    <DescriptionListTermHelpTextButton>{t('Strategy')}</DescriptionListTermHelpTextButton>
                  </Popover>
                </DescriptionListTermHelpText>
                <DescriptionListDescription>{obj?.spec?.strategy?.blueGreen ? "Blue-Green" : "Canary"}</DescriptionListDescription>
              </DescriptionListGroup>

              {obj?.spec?.strategy?.blueGreen ?
                <BlueGreenServices rollout={obj}/>
              :
                <CanaryServices rollout={obj}/>
              }

            </DescriptionList>
          </GridItem>
        </Grid>
      </PageSection>

    </div>
  );
};

export default RolloutDetailsPage;
