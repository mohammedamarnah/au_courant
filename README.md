# au_courant

au cou·rant /ˌō ˈko͝oränt/ | adjective | Aware of what is going on; well informed.

A RESTful API to keep track of and to be up-to-date on github project releases.

## Usage

### Add a user 
Adds a user with a given name and password to the database. returns a JWT (JSON Web Token) for authentication.

`[POST] /add-user`

#### Parameters
| Name | In | Type |
| ---- | -- | ---- |
| `name` | `query` | `string` |
| `password` | `query` | `string` |

----
### Generate a token for a user
Generates the token associated with an existing user. Returns 403 if the user is not found.

`[GET] /generate-token`

#### Parameters
| Name | In | Type |
| ---- | -- | ---- |
| `name` | `query` | `string` |
| `password` | `query` | `string` |

----
### Get all repositories
returns all repositories' releases info that is stored in the database.

`[GET] /repos`

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


## Local Development

### Clojure

Make sure [leiningen](https://leiningen.org/) is installed in your device. To run the development server:

`lein run`

You can also run the interactive REPL:

`lein repl`

This project was also built with [GraalVM](https://www.graalvm.org/) native image support. This allows for a tremendous startup speed.

To compile a native image of this project run:

`lein native` 

### PostgreSQL

The database that was used in this project is PostgreSQL. If you're on MacOS, install the [PostgreSQL app](https://postgresapp.com/).

To configure the database check `config/db_config.json`.

```json
{
  "host": "localhost",
  "user": "user",
  "password": "",
  "dbname": "database_name"
}
```
