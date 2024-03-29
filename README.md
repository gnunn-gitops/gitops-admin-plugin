# Introduction

This project is intended as a POC to understand the feasibility of using a [console dynamic plugin](https://docs.openshift.com/container-platform/4.13/web_console/dynamic-plugin/overview-dynamic-plugin.html) in OpenShift to manage OpenShift GitOps, aka Argo CD. The goals of the POC were:

1. Provide a basic view of Application, ApplicationSet and AppProjects objects in the OpenShift console
2. Support common interactions with Argo CD for operations like Sync, Refresh and Hard Refresh
3. Provide basic support for Rollouts in the Admin perspective including operations like Promote, Promote Full, etc

Note that this plugin is community supported and is not part of the OpenShift GitOps product nor supported by Red Hat. I assume no responsibility for anything that goes wrong so caveat emptor.

![alt text](https://raw.githubusercontent.com/gnunn-gitops/gitops-admin-plugin/main/docs/img/gitops-admin-plugin-list.png)

More screenshots:

[Application Details](https://raw.githubusercontent.com/gnunn-gitops/gitops-admin-plugin/main/docs/img/gitops-admin-plugin-details.png)

[Rollouts Details](https://raw.githubusercontent.com/gnunn-gitops/gitops-admin-plugin/main/docs/img/rollouts-details.png)

# Current Status

The following table shows the current status of development.

| Custom Resource  | Goal Status          | Comments        |
| ------------- | -------------      | -------------- |
| Application  | 100%  | Feature complete |
| AppProject  | 100%  | Feature complete |
| ApplicationSet | 20% | Default OpenShift view with an additional tab to view list of associated applications. |
| Rollout | 90% | Feature complete implementation, needs more testing but everything is there in terms of goals. |

# Philosophy

This plugin is not intended as a general replacement for the Argo CD UI since it operates under a different philosophy. Specifically the OpenShift Console is a Kubernetes resource driven view of the cluster and this plugin adheres to that philosophy.

If the user has Kubernetes RBAC permissions to view Application objects then it will appear in this plugin. If the user has permissions to update and patch the Application objects then they will be able to sync and refresh the application. Argo RBAC is not used at all in the plugin.

As a result this plugin is not particularly suitable for users working with Argo CD in multi-tenant deployments. This is because in a multi-tenant scenario Argo RBAC must be used to enforce separation between tenants and tenants cannot be allowed direct access to the namespace where Argo CD and the Applications are deployed. Otherwise the user will be able to view secrets they should not have access to, potentially modify Application objects to bypass Argo CD RBAC, etc.

I am very optimistic that when [Applications in Any Namespace](https://argo-cd.readthedocs.io/en/stable/operator-manual/app-any-namespace) becomes GA this will become the preferred way to manage tenancy in Argo CD and the plugins resource based philosophy is well suited for this.

However at this time the plugin is most suited for cluster and Argo CD administrators who will typically have elevated permissions.

# Limitations

There are some limitations in this current implementation:

- Limited testing across the wide swath of Argo CD features, for example Helm apps have only been lightly tested.
- Limited error handling, if something does not work as expected check the browser console logs
- No general editing capabilities beyond editing the yaml
- Limited useability testing but suggestions for UI improvements definitely welcome!

# Prerequisites

The following prerequisites are required to use this plugin:

* OpenShift 4.12+
* OpenShift GitOps 1.8+ or Argo CD 2.6+ (tested with OpenShift GitOps 1.9/Argo CD 2.7)

## Deployment on cluster

The plugin can be installed from the manifests included in the `/manifests` folder using kustomize.

```
oc apply -k https://github.com/gnunn-gitops/gitops-admin-plugin/manifests/overlays/install
```

Note the `install` overlay include a job with the elevated permissions needed to patch `consoles.operator.openshift.io` to include this plugin. This enables deployment via Argo CD since everything is automated.

After running this command it may take a few minutes for the plugin to appear, check `oc get co` to see the status of the console operator.

## Local development

### Option 1:
In one terminal window, run:

1. `yarn install`
2. `yarn run start`

In another terminal window, run:

1. `oc login`
2. `yarn run start-console` (requires [Docker](https://www.docker.com) or [podman](https://podman.io))

You will then be able to access the console with the plugin at `http://localhost:9000` in a browser.

## Container image

You can build the plugin as a container image using podman (or docker if you prefer) with the following command:

```
podman build . -t <your-image-name>
```

The image used by the manifests is hosted at [quay.io/gnunn/gitops-admin-plugin](quay.io/gnunn/gitops-admin-plugin).

## Acknowledgements

Thanks to the following individuals:

* Pavel Kratochvíl whose [crontab](https://github.com/raspbeep/crontab-plugin/tree/initial-branch) example provides a great starting point for building plugins needed to support CRDs.
* Andrew Block for Kyverno policy plugin and getting me over the Typescript/react hump
* Keith Chong for his work on the Developers perspective GitOps plugin from which I borrowed a few things.
* Argo CD UI where I leveraged it for A/B testing plus re-used some of the existing code there instead of re-inventing the wheel. All rights remain with original authors, code I specifically use:
  - code for determining Operation State
  - code for calculating URLs for git repos and paths
