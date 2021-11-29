(ns au-courant.db
  (:require [au-courant.db-schema :refer [db-spec repos-schema users-schema]]
            [clojure.java.jdbc :as jdbc]))

;;
;; repositories
;;
(defn create-repos-table!
  "Creates the initial database."
  []
  (jdbc/db-do-commands
   db-spec
   (jdbc/create-table-ddl :repositories repos-schema)))

(defn add-repo!
  "Stores the repository information into
  the database."
  [params]
  (jdbc/insert! db-spec :repositories params))

(defn remove-repo!
  "Removes a repository with a given name"
  [repo-name]
  (jdbc/delete! db-spec :repositories ["repo_name = ?" repo-name]))

(defn update-repo!
  "Updates a repository with the given params"
  [{repo-name :repo_name :as params}]
  (jdbc/update! db-spec :repositories params ["repo_name = ?" repo-name]))

(defn get-repos
  "Gets the repository with the `repo-id`.
  If `repo-id` was not supplied, returns 
  all repos."
  ([]
   (jdbc/query db-spec ["SELECT * FROM repositories"]))
  ([repo-name]
   (->
    (jdbc/query db-spec ["SELECT * FROM repositories WHERE repo_name = ?" repo-name])
    first)))

(defn mark-seen!
  "Marks a repository in the database as 
  seen."
  [repo-name]
  (jdbc/update! db-spec :repositories {:seen_state true} ["repo_name = ?" repo-name]))

;;
;; users 
;;
(defn create-users-table!
  "Creates the users table"
  []
  (jdbc/db-do-commands
   db-spec
   (jdbc/create-table-ddl :users users-schema)))

(defn add-user!
  "Adds a user and a password to the 
  database."
  [params]
  (jdbc/insert! db-spec :users params))

(defn get-user
  "Gets user information with a specific
  name."
  [name]
  (first (jdbc/query db-spec ["SELECT * FROM users WHERE name = ?" name])))

