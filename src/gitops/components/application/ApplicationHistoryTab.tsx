import * as React from 'react';
import { RouteComponentProps } from 'react-router';

import HistoryList from './History/History';
import { ApplicationHistory, ApplicationKind } from '@gitops-models/ApplicationModel';
import { PageSection, PageSectionVariants } from '@patternfly/react-core';

type ApplicationHistoryTabProps = RouteComponentProps<{
  ns: string;
  name: string;
}> & {
  obj?: ApplicationKind;
};

const ApplicationHistoryTab: React.FC<ApplicationHistoryTabProps> = ({ obj }) => {

    var history: ApplicationHistory[];
    if (obj?.status?.history) {
      history = obj?.status?.history;
    } else {
      history = [];
    }

    return (
        <PageSection variant={PageSectionVariants.light}>
            <HistoryList history={history}/>
        </PageSection>
  );
};

export default ApplicationHistoryTab;
