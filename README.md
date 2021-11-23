# au_courant

au cou·rant /ˌō ˈko͝oränt/ | adjective | Aware of what is going on; well informed.

A RESTful API to keep track of and to be up-to-date on github project releases.

## Usage

----
### Get all repositories
returns all repositories' releases info that is stored in the database.

`[GET] /get-repos`

----
### Get a specific repository
returns a repository release info with a specific `id`.

`[GET] /repos/:id`

#### Parameters
| Name | In | Type |
| ---- | -- | ---- |
| `id` | `query` | `integer` |

----
### Add a repository
adds a repository release info to the database.

`[POST] /add-repo?owner=#{owner}&repo=#{repo}`

#### Parameters
| Name | In | Type |
| ---- | -- | ---- |
| `owner` | `query` | `string` |
| `repo` | `query` | `string` |

----
### Mark a repository as seen
marks a repository seen state with `id` as seen.

`[POST] /mark-seen/:id`

#### Parameters
| Name | In | Type |
| ---- | -- | ---- |
| `id` | `query` | `integer` |


## License

Copyright © 2021 FIXME

This program and the accompanying materials are made available under the
terms of the Eclipse Public License 2.0 which is available at
http://www.eclipse.org/legal/epl-2.0.

This Source Code may also be made available under the following Secondary
Licenses when the conditions for such availability set forth in the Eclipse
Public License, v. 2.0 are satisfied: GNU General Public License as published by
the Free Software Foundation, either version 2 of the License, or (at your
option) any later version, with the GNU Classpath Exception which is available
at https://www.gnu.org/software/classpath/license.html.
