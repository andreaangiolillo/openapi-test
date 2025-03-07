// Copyright 2024 MongoDB Inc
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package changelog

import (
	"github.com/mongodb/openapi/tools/cli/internal/cli/changelog/convert"
	"github.com/mongodb/openapi/tools/cli/internal/cli/changelog/metadata"
	"github.com/spf13/cobra"
)

func Builder() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "changelog",
		Short: "Manage the API Changelog for the OpenAPI spec.",
	}

	cmd.AddCommand(
		CreateBuilder(),
		metadata.Builder(),
		convert.Builder(),
	)

	return cmd
}
