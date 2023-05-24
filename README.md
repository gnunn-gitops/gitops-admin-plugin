# Introduction

This is intended as a POC to understand the feasibility of building a in the OpenShift console to manage OpenShift GitOps. Goals of the POC were:

1. Provide a basic view of Application objects in the OpenShift console
2. Support common interactions with Argo CD for operations like Sync, Refresh and Hard Refresh

This is not intended as a general replacement for the Argo CD UI since it operates under a different philosphy. Specifically the OpenShift Console is a Kubernetes resource driven view of the cluster and this plugin adheres to that philosphy.

If the console user has the necessary Kubernetes RBAC to see the object then it will be shown to them, Argo CD RBAC is not used at all to evaluate object visibility. Having said that, any interaction with the Argo CD API does use the identity of the console user and thus will respect Argo CD RBAC.

![alt text](https://raw.githubusercontent.com/gnunn-gitops/gitops-admin-plugin/main/docs/img/gitops-admin-plugin-list.png)

# Prerequisites

In order for this plugin to interact with the Argo CD API it performs a token exchange with Dex. At the moment the only features that depend on this ability are triggering a Sync and Refresh in Application objects.

To replace the default Dex provided by OpenShift Gitops with an image that supports token exchange modify the following in your Argo CD CR under `spec.sso.dex`:

```
   sso:
      dex:
         image: quay.io/gnunn/dex
         version: token-exchange-1.8
```

Note the above is not supported by Red Hat and not recommended in production environments.

## Deployment on cluster


### Installing the Helm Chart
A [Helm](https://helm.sh) chart is available to deploy the plugin to an OpenShift environment.

To deploy the plugin on a cluster using a Helm chart:
```shell
helm upgrade -i gitops-admin-plugin charts/openshift-console-plugin -n gitops-admin-plugin --create-namespace --set plugin.image=quay.io/gnunn/gitops-admin-plugin:latest
```

`-i gitops-admin-plugin`: specifies installation of a release named `gitops-admin-plugin`

`-n gitops-admin-plugin --create-namespace`: creates a new namespace for the helm chart

`plugin.image`: Specifies the location of the image containing the plugin, to be deployed

Additional parameters can be specified if desired. Consult the chart [values](charts/openshift-console-plugin/values.yaml) file for the full set of supported parameters.

## Local development

### Option 1:
In one terminal window, run:

1. `yarn install`
2. `yarn run start`

In another terminal window, run:

1. `oc login`
2. `yarn run start-console` (requires [Docker](https://www.docker.com) or [podman](https://podman.io))

## Docker image

Before you can deploy your plugin on a cluster, you must build an image and
push it to an image registry.

1. Build the image:

   NOTE: If you have a Mac with Apple silicon, you will need to add the flag
   `--platform=linux/amd64` when building the image to target the correct platform
   to run in-cluster.

   ```sh
   docker build -f Dockerfile -t $NAME/gitops-plugin:latest . --no-cache
   ```

3. Push the image:

   ```sh
   docker push $NAME/gitops-plugin:latest
   ```

## Token Architecture

OpenShift dynamic plugins run in the browser as part of the OpenShift console, they inherit the identity of the current logged in user. We need to use the current identity to interact with Argo so that the proper Argo RBAC can be applied for any features outside the scope of Kubernetes resouce RBAC. Looking up and using the admin secret for Argo would bypass the Argo RBAC plus for cases where Applications in Any Namespace is in place the currently logged in user may not have access to that secret either.

The challenge with using the current identity is that in OpenShift GitOps access to Argo is protected by Dex and requires a Dex OIDC token, not an OpenShift OAuth token, to interact with Argo APIs. This involves overcoming two obstacles: Getting an OpenShift session token for the current user and exchanging it for a Dex token.

Taking the second part first, while Token Exchange is not currently supported in Dex there is a [PR](https://github.com/dexidp/dex/pull/2806) available for it. I tested the PR and wrote a bit of [Go code](https://github.com/gnunn1/dex/blob/dex-token-exchange/connector/openshift/openshift.go#L202) plus a horrific [hack](https://github.com/gnunn1/dex/blob/dex-token-exchange/connector/openshift/openshift.go#L69) and was able to get the token exchange to work.

For the first part, the only way to get the OAuth token from the token is to have a proxy service in the console as per this [documentation](https://github.com/openshift/enhancements/blob/master/enhancements/console/dynamic-plugins.md#delivering-plugins). The [gitops-plugin-proxy](https://github.com/gnunn-gitops/gitops-plugin-proxy) is a small Go application that will accept requests from the plugin in the console, extract the OAuth token and perform a token exchange with Dex before calling the requested Argo CD API.

## Acknowledgements

Thanks to the following individuals:

* Pavel Kratochvíl whose [crontab](https://github.com/raspbeep/crontab-plugin/tree/initial-branch) example provides a great starting point for building plugins needed to support CRDs.
* Andrew Block for Kyverno policy plugin and getting me over the Typescript/react hump
* Keith Chong for his work on the Developers perspective GitOps plugin from which I borrowed a few things.
* Argo CD UI where I leveraged the existing code for determining Operation State
