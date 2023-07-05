import * as React from 'react';
import { useGitOpsTranslation } from "@gitops-utils/hooks/useGitOpsTranslation";
import PencilAltIcon from '@patternfly/react-icons/dist/esm/icons/pencil-alt-icon';
import { K8sModel, K8sResourceCommon, ResourceLink, Timestamp, k8sPatch } from "@openshift-console/dynamic-plugin-sdk";
import { Button, DescriptionListDescription, DescriptionListGroup, DescriptionListTermHelpText, DescriptionListTermHelpTextButton, Popover, Split, SplitItem } from "@patternfly/react-core";
import MetadataLabels from './MetadataLabels';
import { useModal } from '@gitops-utils/components/ModalProvider/ModalProvider';
import { LabelsModal } from '@shared/views/modals/LabelsModal/LabelsModal';
import { AnnotationsModal } from '@shared/views/modals/AnnotationsModal/AnnotationsModal';

export enum Details {
    Name,
    Namespace,
    Labels,
    Annotations,
    Created
}

type StandardDetailsGroupProps = {
    obj: K8sResourceCommon;
    model: K8sModel;
    canPatch: [boolean, boolean];
    exclude: Details[];
};

const StandardDetailsGroup: React.FC<StandardDetailsGroupProps> = ({ obj, model, canPatch, exclude }) => {
    const { t } = useGitOpsTranslation();
    const { createModal } = useModal();

    const onEditLabels = () => {
        createModal(({ isOpen, onClose }) => (
          <LabelsModal
            obj={obj}
            isOpen={isOpen}
            onClose={onClose}
            onLabelsSubmit={(labels) =>
              k8sPatch({
                model: model,
                resource: obj,
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
        ))
      }

      const onEditAnnotations = () => {
        createModal(({ isOpen, onClose }) => (
          <AnnotationsModal
            obj={obj}
            isOpen={isOpen}
            onClose={onClose}
            onSubmit={(annotations) =>
              k8sPatch({
                model: model,
                resource: obj,
                data: [
                  {
                    op: 'replace',
                    path: '/metadata/annotations',
                    value: annotations,
                  },
                ],
              })
            }
          />
        ))
      }


    return (
        <>
        {!(Details.Name in exclude) &&
          <DescriptionListGroup>
            <DescriptionListTermHelpText>
              <Popover headerContent={<div>{t('Name')}</div>} bodyContent={<div>{t('Name must be unique within a namespace.')}</div>}>
                <DescriptionListTermHelpTextButton>{t('Name')}</DescriptionListTermHelpTextButton>
              </Popover>
            </DescriptionListTermHelpText>
            <DescriptionListDescription>
                {obj?.metadata?.name}
            </DescriptionListDescription>
          </DescriptionListGroup>
        }

        {!(Details.Namespace in exclude) &&
          <DescriptionListGroup>
            <DescriptionListTermHelpText>
              <Popover headerContent={<div>{t('Namespace')}</div>} bodyContent={<div>{t('Namespace defines the space within which each name must be unique.')}</div>}>
                <DescriptionListTermHelpTextButton>{t('Namespace')}</DescriptionListTermHelpTextButton>
              </Popover>
            </DescriptionListTermHelpText>
            <DescriptionListDescription>
              <ResourceLink kind="Namespace" name={obj?.metadata?.namespace} />
            </DescriptionListDescription>
          </DescriptionListGroup>
        }

        {!(Details.Labels in exclude) &&
          <DescriptionListGroup>
            <Split>
              <SplitItem isFilled>
                <DescriptionListTermHelpText>
                  <Popover headerContent={<div>{t('Labels')}</div>} bodyContent={<div>{t('Map of string keys and values that can be used to organize and categorize (scope and select) objects.')}</div>}>
                    <DescriptionListTermHelpTextButton>
                      {t('Labels')}
                    </DescriptionListTermHelpTextButton>
                  </Popover>
                </DescriptionListTermHelpText>
              </SplitItem>
              <SplitItem>
                <Button variant="link" isInline isDisabled={!canPatch} icon={<PencilAltIcon />} iconPosition={'right'} onClick={onEditLabels}>{t(' Edit')}</Button>
              </SplitItem>
            </Split>
            <DescriptionListDescription>
              <MetadataLabels labels={obj?.metadata?.labels} />
            </DescriptionListDescription>
          </DescriptionListGroup>
        }

        {!(Details.Annotations in exclude) &&
          <DescriptionListGroup>
            <DescriptionListTermHelpText>
              <Popover headerContent={<div>{t('Annotations')}</div>} bodyContent={<div>{t('Annotations is an unstructured key value map stored with a resource that may be set by external tools to store and retrieve arbitrary metadata. They are not queryable and should be preserved when modifying objects.')}</div>}>
                <DescriptionListTermHelpTextButton>
                  {t('Annotations')}
                </DescriptionListTermHelpTextButton>
              </Popover>
            </DescriptionListTermHelpText>
            <DescriptionListDescription>
              <div>
                <Button variant="link" isInline isDisabled={!canPatch} icon={<PencilAltIcon />} iconPosition={'right'} onClick={onEditAnnotations}>{(obj.metadata?.annotations ? Object.keys(obj.metadata.annotations).length: 0) + t(' Annotations')}</Button>
              </div>
            </DescriptionListDescription>
          </DescriptionListGroup>
        }

        {!(Details.Created in exclude) &&
          <DescriptionListGroup>
            <DescriptionListTermHelpText>
              <Popover headerContent={<div>{t('Created at')}</div>} bodyContent={<div>{t('Time is a wrapper around time. Time which supports correct marshaling to YAML and JSON.')}</div>}>
                <DescriptionListTermHelpTextButton>{t('Created at')}</DescriptionListTermHelpTextButton>
              </Popover>
            </DescriptionListTermHelpText>
            <DescriptionListDescription>
              {<Timestamp timestamp={obj?.metadata?.creationTimestamp} />}
            </DescriptionListDescription>
          </DescriptionListGroup>
        }
      </>
    )
}

export default StandardDetailsGroup;
