import * as React from "react";
import ApplicationListFragment from "@gitops-shared/ApplicationList";

type ApplicationListProps = {
  namespace: string;
  hideNameLabelFilters?: boolean;
  showTitle?: boolean;
}

const ApplicationListTab: React.FC<ApplicationListProps> = ({ namespace, hideNameLabelFilters, showTitle }) => {
  console.log(hideNameLabelFilters);
  return (
    <ApplicationListFragment
      namespace={namespace}
      hideNameLabelFilters={hideNameLabelFilters}
      showTitle={showTitle}
    />
  )
}

export default ApplicationListTab;
