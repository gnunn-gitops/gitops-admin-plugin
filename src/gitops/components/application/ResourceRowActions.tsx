import * as React from 'react';
import { ApplicationKind, ApplicationResourceStatus } from '@gitops-models/ApplicationModel';
import { syncResourcek8s } from '@gitops-services/ArgoCD';
import { useK8sModel, k8sGet, useDeleteModal } from '@openshift-console/dynamic-plugin-sdk';
import { Dropdown, DropdownItem, KebabToggle } from '@patternfly/react-core/deprecated';

type ResourceRowActionsProps = {
    resource: ApplicationResourceStatus;
    application: ApplicationKind;
    argoBaseURL: string;
  };

  function getResourceURL(argoBaseURL: string, resource: ApplicationResourceStatus): string {
    return argoBaseURL+"?resource=&node=" + encodeURI((resource.group?resource.group:"") + "/" + resource.kind + "/" + (resource.namespace?resource.namespace:"") + "/" + resource.name);
  }

  const ResourceRowActions: React.FC<ResourceRowActionsProps> = ({ resource, application, argoBaseURL }) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [model] = useK8sModel({ group: resource.group, version: resource.version, kind: resource.kind });
    const [object, setObject] = React.useState(null);

    k8sGet({
                model: model,
                name: resource.name,
                ns: resource.namespace,
    }).then((object) => {setObject(object)});

    const onViewResource = () => {
      window.open(getResourceURL(argoBaseURL, resource), '_blank');
    };

    const onSyncResource = () => {
      syncResourcek8s(application, [resource])
    };

    const onToggle = (_event: any, isOpen: boolean) => {
        setIsOpen(isOpen);
    };

    return (
      <Dropdown
        menuAppendTo={getContentScrollableElement}
        onSelect={() => setIsOpen(false)}
        toggle={<KebabToggle onToggle={onToggle} id="toggle-id-disk" />}
        isOpen={isOpen}
        isPlain
        dropdownItems={[
          <DropdownItem onClick={onViewResource} key="resource-diff">
            {'Details'}
          </DropdownItem>,
          <DropdownItem onClick={onSyncResource} key="resource-sync" isDisabled={resource.status==undefined}>
            {'Sync'}
          </DropdownItem>,
          <DropdownItem onClick={useDeleteModal(object)} key="resource-delete">
            {'Delete'}
          </DropdownItem>
        ]}
      />
    );
  };

  export const getContentScrollableElement = (): HTMLElement =>
    document.getElementById('content-scrollable');

  export default ResourceRowActions;
