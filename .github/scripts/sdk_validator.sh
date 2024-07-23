#!/bin/bash
set -euo pipefail

export OPENAPI_FILE_NAME="atlas-sdk.yaml"

sdk_validate() {
  if [ "$#" -ne 1 ]; then
    echo "Error: Incorrect number of arguments. Usage: sdk_validate <OPENAPI_SOURCE_FILE_PATH>"
    return 1
  fi

  local openapi_source_file=$1
  checkout_folder=./go/go-client
  sdk_tooling_url=git@github.com:mongodb/atlas-sdk-go.git
  release_branch="${GO_SDK_BRANCH:-main}"
  echo "Fetching prerequisites"

  if [[ -d "${checkout_folder}" ]]; then
    echo "Tooling repository already present"
  else
    git clone "${sdk_tooling_url}" \
      --depth 1 \
      --branch "${release_branch}" \
      --single-branch "${checkout_folder}" \
      1> /dev/null
  fi

  cp -rf "${openapi_source_file}" "${checkout_folder}/openapi/${OPENAPI_FILE_NAME:?}"

  pushd "./$checkout_folder"
  ## Running upstream openapi validator
  make -e openapi-pipeline
  popd
}
