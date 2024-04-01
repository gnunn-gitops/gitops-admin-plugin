import * as React from 'react';
import { useHistory } from 'react-router-dom';

import { ApplicationKind, ApplicationModel, applicationModelRef } from '@gitops-models/ApplicationModel';
import { Action, K8sVerb, useLabelsModal, useAnnotationsModal, useDeleteModal, getGroupVersionKindForResource, useK8sModel } from '@openshift-console/dynamic-plugin-sdk';

import { syncAppK8s, refreshAppk8s, terminateOpK8s } from '@gitops-services/ArgoCD';
import { PhaseStatus } from '@gitops-utils/constants';
import { getAppOperationState } from '@gitops-utils/gitops';

type UseApplicationActionsProvider = (
  application: ApplicationKind,
) => [actions: Action[] ];
const t = (key: string) => key;

export const useApplicationActionsProvider: UseApplicationActionsProvider = (application) => {

  const history = useHistory();

//   const groupVersionKind = getGroupVersionKindForResource(application);
//   const [kind] = useK8sModel(groupVersionKind);
//   console.log(kind);

  const launchLabelsModal = useLabelsModal(application);
  const launchAnnotationsModal = useAnnotationsModal(application);
  const launchDeleteModal = useDeleteModal(application);

  // TODO - Need to get namespace into accessReview, application is undefined so there needs to be a callback
  // of some sort. React.useCallback didn't work
  const actions = React.useMemo(
    () => [
      {
        id: 'gitops-action-sync-application',
        disabled: (application && application.status?.operationState?.phase && (application.status?.operationState?.phase == PhaseStatus.RUNNING)),
        label: t('Sync'),
        accessReview: {
          group: ApplicationModel.apiGroup,
          verb: 'update' as K8sVerb,
          resource: ApplicationModel.plural,
          namespace: application?.metadata?.namespace
        },
        cta: () =>
          // TODO - Show toast alert if it fails but this is proving more challenging then I thought
          syncAppK8s(application)
      },
      {
        id: 'gitops-action-stop-application',
        disabled: (application && application.status?.operationState?.phase && getAppOperationState(application).phase != PhaseStatus.RUNNING),
        label: t('Stop'),
        accessReview: {
          group: ApplicationModel.apiGroup,
          verb: 'patch' as K8sVerb,
          resource: ApplicationModel.plural,
          namespace: application?.metadata?.namespace
        },
        cta: () =>
          // TODO - Show toast alert if it fails but this is proving more challenging then I thought
          terminateOpK8s(application)
      },
      {
        id: 'gitops-action-refresh-application',
        disabled: false,
        label: t('Refresh'),
        accessReview: {
          group: ApplicationModel.apiGroup,
          verb: 'update' as K8sVerb,
          resource: ApplicationModel.plural,
          namespace: application?.metadata?.namespace
        },
        cta: () =>
          // TODO - Show toast alert if it fails but this is proving more challenging then I thought
          refreshAppk8s(application, false)
      },
      {
        id: 'gitops-action-refresh-hard-application',
        disabled: false,
        label: t('Refresh (Hard)'),
        accessReview: {
          group: ApplicationModel.apiGroup,
          verb: 'update' as K8sVerb,
          resource: ApplicationModel.plural,
          namespace: application?.metadata?.namespace
        },
        cta: () =>
          // TODO - Show toast alert if it fails but this is proving more challenging then I thought
          refreshAppk8s(application, true)
      },
      {
        id: 'gitops-action-edit-labels-application',
        disabled: false,
        label: t('Edit labels'),
        accessReview: {
          group: ApplicationModel.apiGroup,
          verb: 'patch' as K8sVerb,
          resource: ApplicationModel.plural,
          namespace: application?.metadata?.namespace
        },
        cta: () => {launchLabelsModal()}
      },
      {
        id: 'gitops-action-edit-annotations-application',
        disabled: false,
        accessReview: {
          group: ApplicationModel.apiGroup,
          verb: 'patch' as K8sVerb,
          resource: ApplicationModel.plural,
          namespace: application?.metadata?.namespace
        },
        label: t('Edit annotations'),
        cta: () => {launchAnnotationsModal()}
      },
      {
        id: 'gitops-action-edit-application',
        disabled: false,
        label: t('Edit Application'),
        accessReview: {
          group: ApplicationModel.apiGroup,
          verb: 'update' as K8sVerb,
          resource: ApplicationModel.plural,
          namespace: application?.metadata?.namespace
        },
        cta: () =>
          history.push(
            `/k8s/ns/${application.metadata.namespace}/${applicationModelRef}/${application.metadata.name}/yaml`,
          ),
      },
      {
        id: 'gitops-action-delete-application',
        disabled: false,
        label: t('Delete Application'),
        accessReview: {
          group: ApplicationModel.apiGroup,
          verb: 'delete' as K8sVerb,
          resource: ApplicationModel.plural
        },
        cta: () => {launchDeleteModal()}
      }
    ],
    [t, application, history],
  );

  return [actions];
};
