import React from "react";
import ApplicationListFragment from "../components/ApplicationList/ApplicationListFragment";

type ApplicationListProps = {
  namespace: string;
  hideNameLabelFilters?: boolean;
  showTitle?: boolean;
}

const ApplicationList: React.FC<ApplicationListProps> = ({ namespace, hideNameLabelFilters, showTitle }) => {
  console.log(hideNameLabelFilters);
  return (
    <ApplicationListFragment
      namespace={namespace}
      hideNameLabelFilters={hideNameLabelFilters}
      showTitle={showTitle}
    />
  )
}

export default ApplicationList;