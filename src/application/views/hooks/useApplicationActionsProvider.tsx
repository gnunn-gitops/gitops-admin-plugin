import React from 'react';
import { useHistory } from 'react-router-dom';

import { ApplicationKind, ApplicationModel, applicationModelRef } from '@application-model';
import { useModal } from '@gitops-utils/components/ModalProvider/ModalProvider';
import { Action, k8sPatch } from '@openshift-console/dynamic-plugin-sdk';

import { AnnotationsModal } from '../../../shared/views/modals/AnnotationsModal/AnnotationsModal';
import { LabelsModal } from '../../../shared/views/modals/LabelsModal/LabelsModal';
import { refreshApp, syncApp } from 'src/services/argocd';
import ResourceDeleteModal from '@shared/views/modals/ResourceDeleteModal/ResourceDeleteModal';

type UseApplicationActionsProvider = (
  application: ApplicationKind,
) => [actions: Action[] /*, onOpen: () => void*/];
const t = (key: string) => key;

export const useApplicationActionsProvider: UseApplicationActionsProvider = (application) => {
  const { createModal } = useModal();
  const history = useHistory();

  const actions = React.useMemo(
    () => [
      {
        id: 'gitops-action-sync-application',
        disabled: false,
        label: t('Sync'),
        cta: () =>
          // TODO - Show toast alert if it fails but this is proving more challenging then I thought
          syncApp(application)
      },
      {
        id: 'gitops-action-refresh-application',
        disabled: false,
        label: t('Refresh'),
        cta: () =>
          // TODO - Show toast alert if it fails but this is proving more challenging then I thought
         refreshApp(application, false)
      },
      {
        id: 'gitops-action-refresh-hard-application',
        disabled: false,
        label: t('Refresh (Hard)'),
        cta: () =>
          // TODO - Show toast alert if it fails but this is proving more challenging then I thought
          refreshApp(application, true)
      },
      {
        id: 'dataimportcron-action-edit-labels',
        disabled: false,
        label: t('Edit labels'),
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
        cta: () =>
          history.push(
            `/k8s/ns/${application.metadata.namespace}/${applicationModelRef}/${application.metadata.name}/yaml`,
          ),
      },
      {
        id: 'application-action-delete',
        label: t('Delete'),
        cta: () =>
          createModal(({ isOpen, onClose }) => (
            <ResourceDeleteModal
            resource={application}
            isOpen={isOpen}
            onClose={onClose}
          />
        )),
        //   ,accessReview: asAccessReview(DataImportCronModel, application, 'delete'),
      }

    ],
    [/*t, */ application, createModal /*, dataSource*/, history],
  );

  return [actions];
};
