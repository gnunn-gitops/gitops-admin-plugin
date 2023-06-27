import React from 'react';
import { useHistory } from 'react-router-dom';

import { AppProjectKind, AppProjectModel, appProjectModelRef } from '@appproject-model';
import { useModal } from '@gitops-utils/components/ModalProvider/ModalProvider';
import { Action, k8sPatch } from '@openshift-console/dynamic-plugin-sdk';

import { AnnotationsModal } from '@shared/views/modals/AnnotationsModal/AnnotationsModal';
import { LabelsModal } from '@shared/views/modals/LabelsModal/LabelsModal';
import ResourceDeleteModal from '@shared/views/modals/ResourceDeleteModal/ResourceDeleteModal';

type UseAppProjectActionsProvider = (
  appProject: AppProjectKind,
) => [actions: Action[] /*, onOpen: () => void*/];
const t = (key: string) => key;

export const useAppProjectActionsProvider: UseAppProjectActionsProvider = (appProject) => {
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
              obj={appProject}
              isOpen={isOpen}
              onClose={onClose}
              onLabelsSubmit={(labels) =>
                k8sPatch({
                  model: AppProjectModel,
                  resource: appProject,
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
        id: 'crontab-action-edit-annotations',
        disabled: false,
        label: t('Edit annotations'),
        cta: () =>
          createModal(({ isOpen, onClose }) => (
            <AnnotationsModal
              obj={appProject}
              isOpen={isOpen}
              onClose={onClose}
              onSubmit={(updatedAnnotations) =>
                k8sPatch({
                  model: AppProjectModel,
                  resource: appProject,
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
        id: 'crontab-action-edit-crontab',
        disabled: false,
        label: t('Edit'),
        cta: () =>
          history.push(
            `/k8s/ns/${appProject.metadata.namespace}/${appProjectModelRef}/${appProject.metadata.name}/yaml`,
          ),
      },
      {
        id: 'crontab-action-delete',
        label: t('Delete'),
        cta: () =>
          createModal(({ isOpen, onClose }) => (
            <ResourceDeleteModal
              resource={appProject}
              isOpen={isOpen}
              onClose={onClose}
              pushHistory={true}
            />
          )),
        //   ,accessReview: asAccessReview(DataImportCronModel, cronTab, 'delete'),
      },
    ],
    [/*t, */ appProject, createModal /*, dataSource*/, history],
  );

  return [actions];
};
