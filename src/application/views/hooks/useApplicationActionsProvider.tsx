import React from 'react';
import { useHistory } from 'react-router-dom';

import { ApplicationKind, ApplicationModel, applicationModelRef } from '@application-model';
import { useModal } from '@gitops-utils/components/ModalProvider/ModalProvider';
import { Action, k8sDelete, k8sPatch } from '@openshift-console/dynamic-plugin-sdk';

import { AnnotationsModal } from '../modals/AnnotationsModal/AnnotationsModal';
import DeleteModal from '../modals/DeleteModal/DeleteModal';
import { LabelsModal } from '../modals/LabelsModal/LabelsModal';
import { sync } from '@gitops-utils/gitops';

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
            <DeleteModal
              obj={application}
              isOpen={isOpen}
              onClose={onClose}
              headerText={t('Delete Application?')}
              onDeleteSubmit={() =>
                k8sDelete({
                  model: ApplicationModel,
                  resource: application,
                })
              }
            />
          )),
        //   ,accessReview: asAccessReview(DataImportCronModel, application, 'delete'),
      },
      {
        id: 'gitops-action-sync-application',
        disabled: false,
        label: t('Sync'),
        cta: () =>
          sync(application)
      },

    ],
    [/*t, */ application, createModal /*, dataSource*/, history],
  );

  return [actions];
};
