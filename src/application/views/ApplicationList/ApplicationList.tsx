import React from "react";
import ApplicationListFragment from "../components/ApplicationList/ApplicationListFragment";

type ApplicationListProps = {
    namespace: string;
  }

const ApplicationList: React.FC<ApplicationListProps> = ({ namespace}) => {
    return (
        <ApplicationListFragment
          namespace={namespace}
        />
    )
}

export default ApplicationList;