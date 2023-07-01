### Deprecated, the plugin is no longer making API calls and is instead updating resources directly to perform operations. Preserving this in case we need to go back to the Argo CD REST API for features

## Token Architecture

OpenShift dynamic plugins run in the browser as part of the OpenShift console, they inherit the identity of the current logged in user. We need to use the current identity to interact with Argo so that the proper Argo RBAC can be applied for any features outside the scope of Kubernetes resouce RBAC. Looking up and using the admin secret for Argo would bypass the Argo RBAC plus for cases where Applications in Any Namespace is in place the currently logged in user may not have access to that secret either.

The challenge with using the current identity is that in OpenShift GitOps access to Argo is protected by Dex and requires a Dex OIDC token, not an OpenShift OAuth token, to interact with Argo APIs. This involves overcoming two obstacles: Getting an OpenShift session token for the current user and exchanging it for a Dex token.

Taking the second part first, while Token Exchange is not currently supported in Dex there is a [PR](https://github.com/dexidp/dex/pull/2806) available for it. I tested the PR and wrote a bit of [Go code](https://github.com/gnunn1/dex/blob/dex-token-exchange/connector/openshift/openshift.go#L202) plus a horrific [hack](https://github.com/gnunn1/dex/blob/dex-token-exchange/connector/openshift/openshift.go#L69) and was able to get the token exchange to work.

For the first part, the only way to get the OAuth token from the token is to have a proxy service in the console as per this [documentation](https://github.com/openshift/enhancements/blob/master/enhancements/console/dynamic-plugins.md#delivering-plugins). The [gitops-plugin-proxy](https://github.com/gnunn-gitops/gitops-plugin-proxy) is a small Go application that will accept requests from the plugin in the console, extract the OAuth token and perform a token exchange with Dex before calling the requested Argo CD API.

![alt text](https://raw.githubusercontent.com/gnunn-gitops/gitops-admin-plugin/main/docs/img/gitops-admin-plugin-architecture.png)
