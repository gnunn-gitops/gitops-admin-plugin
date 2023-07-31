import React from 'react';
import { useHistory } from 'react-router-dom';

import { ApplicationKind, ApplicationModel, applicationModelRef } from '@application-model';
import { useModal } from '@gitops-utils/components/ModalProvider/ModalProvider';
import { Action, K8sVerb, k8sPatch } from '@openshift-console/dynamic-plugin-sdk';

import { AnnotationsModal } from '../../../shared/views/modals/AnnotationsModal/AnnotationsModal';
import { LabelsModal } from '../../../shared/views/modals/LabelsModal/LabelsModal';
import { syncAppK8s, refreshAppk8s, terminateOpK8s } from 'src/services/argocd';
import ResourceDeleteModal from '@shared/views/modals/ResourceDeleteModal/ResourceDeleteModal';
import { PhaseStatus } from '@gitops-utils/constants';
import { getAppOperationState } from '@gitops-utils/gitops';

type UseApplicationActionsProvider = (
  application: ApplicationKind,
) => [actions: Action[] /*, onOpen: () => void*/];
const t = (key: string) => key;

export const useApplicationActionsProvider: UseApplicationActionsProvider = (application) => {
  const { createModal } = useModal();
  const history = useHistory();

  // TODO - Need to get namespace into accessReview, application is undefined so there needs to be a callback
  // of some sort. React.useCallback didn't work
  const actions = React.useMemo(
    () => [
      {
        id: 'gitops-action-sync-application',
        disabled: (application && application.status && (application.status?.operationState?.phase == PhaseStatus.TERMINATING || application.status?.operationState?.phase == PhaseStatus.RUNNING)),
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
        disabled: (application && application.status && getAppOperationState(application).phase != PhaseStatus.RUNNING),
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
        id: 'dataimportcron-action-edit-labels',
        disabled: false,
        label: t('Edit labels'),
        accessReview: {
          group: ApplicationModel.apiGroup,
          verb: 'patch' as K8sVerb,
          resource: ApplicationModel.plural,
          namespace: application?.metadata?.namespace
        },
        cta: () =>
          createModal(({ isOpen, onClose }) => (
            <LabelsModal
              obj={application}
              isOpen={isOpen}
              onClose={onClose}
              onLabelsSubmit={(labels) =>
                k8sPatch({
                  model: ApplicationModel,
                  resource: application,
                  data: [
                    {
                      op: 'replace',
                      path: '/metadata/labels',
                      value: labels,
                    },
                  ],
                })
              }
            />
          )),
      },
      {
        id: 'application-action-edit-annotations',
        disabled: false,
        accessReview: {
          group: ApplicationModel.apiGroup,
          verb: 'patch' as K8sVerb,
          resource: ApplicationModel.plural,
          namespace: application?.metadata?.namespace
        },
        label: t('Edit annotations'),
        cta: () =>
          createModal(({ isOpen, onClose }) => (
            <AnnotationsModal
              obj={application}
              isOpen={isOpen}
              onClose={onClose}
              onSubmit={(updatedAnnotations) =>
                k8sPatch({
                  model: ApplicationModel,
                  resource: application,
                  data: [
                    {
                      op: 'replace',
                      path: '/metadata/annotations',
                      value: updatedAnnotations,
                    },
                  ],
                })
              }
            />
          )),
      },
      {
        id: 'gitops-action-edit-application',
        disabled: false,
        label: t('Edit'),
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
        id: 'application-action-delete',
        disabled: false,
        label: t('Delete'),
        accessReview: {
          group: ApplicationModel.apiGroup,
          verb: 'delete' as K8sVerb,
          resource: ApplicationModel.plural
        },
        cta: () =>
          createModal(({ isOpen, onClose }) => (
            <ResourceDeleteModal
              resource={application}
              isOpen={isOpen}
              onClose={onClose}
              pushHistory={true}
            />
          ))

      }
    ],
    [/*t, */ application, createModal /*, dataSource*/, history],
  );

  return [actions];
};
