# Change log

## Version 1.2.3

-   Add private method `safeJSONparse` to handle non-serializable variables.
-   In version 1.2.2, a maximum of 10 variables were returned by `getJSONVariablesforProcess`. In version 1.2.3, up to 1000 variables are returned.
## Version 1.2.2

### Enhancements

-   Add method `getJSONVariablesforProcess` to return variables as an object.


## Version 1.2.0

### Enhancements

-   Support custom OAuthProvider and baseUrl via constructor to enable multiple clients/clusters per application. See [#4](https://github.com/camunda-community-hub/operate-client-node-js/issues/4) for more details.
