# Note this project has been shelved

This was intended as a POC to understand the feasibility of building a lite UI in the OpenShift POC to manage OpenShift GitOps. Goals of the POC were:

1. Provide a basic view of Application objects in OpenShift
2. Support common interactions with Argo CD for operations like Sync, Refresh and Hard Refresh

Unfortunately at this time Option #2 does not appear to be feasible without signficant Engineering effort or changes in Architecture.

OpenShift dynamic plugins run in the browser as part of the OpenShift console, the inherit the identity of the current logged in user. To support the second use case, we need to use the current identity to interact with Argo so that the proper Argo RBAC can be applied. Looking up and using the admin secret for Argo would bypass the Argo RBAC plus for cases where Applications in Any Namespace is in place the currently logged in user would not have access to that secret either.

The challenge with using the current identity is that in OpenShift GitOps access to Argo is protected by Dex and requires a Dex OIDC token, not an OpenShift OAuth token, to interact with Argo APIs. This involves overcoming two obstacles: Getting an OpenShift session token for the current user and exchanging it for a Dex token.

Taking the second part first, while Token Exchange is not currently supported in Dex there is a [PR](https://github.com/dexidp/dex/pull/2806) available for it. I tested the PR and wrote a bit of [Go code](https://github.com/gnunn1/dex/blob/dex-token-exchange/connector/openshift/openshift.go#L202) plus a horrific [hack](https://github.com/gnunn1/dex/blob/dex-token-exchange/connector/openshift/openshift.go#L69) and was able to get the token exchange to work.

However the first part of the challenge, retrieving the users session token appears to be insurmountable at this time. The session token is stored is an httpOnly cookie which prevents code in the browser from accessing it which is a good thing from a security perspective. Additionally as far as I can tell there is no way to have a new token minted or access this token via an API. Again a good thing since we don't want a malicious plugin sending tokens to bad actors.

Unfortunately this means there is no way to interact with the Argo CD API in a way that fulfills the goals of this POC and hence I'm stopping work on it at this point. Should things change, or someone finds an alternative way to do this, I'm happy to revisit the topic.

Making this work would likely require an internal accessible service in the console be available to do the token exchange for us or provide a way to mint a short lived access token (<5 minutes?) that plugins could leverage.

# OpenShift GitOps Dynamic Plugin

This plugin is a POC level OpenShift Console dynamic plugin to support OpenShift GitOps in the Administrator perspective. At this point it is very rough from a feature and UI perspective and thus absolutely not recommended in production environments.

At the moment it supports viewing Application objects including basic information, sources, deployment history and resources that it is managing. There is currently no interactivity with Argo CD (i.e. sync from the OCP console) but hope to add that in the future.

![alt text](https://raw.githubusercontent.com/gnunn-gitops/gitops-admin-plugin/main/docs/img/gitops-admin-plugin-list.png)

## Acknowledgements

Thanks to the following individuals:

* Pavel Kratochvíl whose [crontab](https://github.com/raspbeep/crontab-plugin/tree/initial-branch) example provides a great starting point for building plugins needed to support CRDs.
* Andrew Block for Kyverno policy plugin and getting me over the Typescript/react hump
* Keith Chong for his work on the Developers perspective GitOps plugin from which I borrowed a few things.
* Argo CD UI where I leveraged the existing code for determining Operation State

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
