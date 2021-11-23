(ns au-courant.db
  (:require [clj-time.coerce :refer [from-string to-timestamp]]
            [clojure.walk :refer [keywordize-keys]]
            [pjson.core :refer [read-str]]
            [clj-postgresql.core :as pg]
            [clojure.java.jdbc :as jdbc]))

(defonce db (-> "config/db_config.json"
                slurp
                read-str
                keywordize-keys))

(defonce db-spec (pg/spec :host (:host db)
                          :user (:user db)
                          :password (:password db)
                          :dbname (:dbname db)))

(defonce repos-schema [[:id :serial "PRIMARY KEY"]
                       [:name :text "NOT NULL"]
                       [:tag_name :text "NOT NULL"]
                       [:published_at :timestamp "NOT NULL"]
                       [:seen_state :boolean "DEFAULT FALSE"]
                       [:body :text]])

(defonce users-schema [[:id :serial "PRIMARY KEY"]
                       [:name :text "NOT NULL"]
                       [:password :text "NOT NULL"]])

(defn create-repos-table!
  "Creates the initial database."
  []
  (jdbc/db-do-commands
   db-spec
   (jdbc/create-table-ddl :repositories repos-schema)))

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

(defn add-repo!
  "Stores the repository information into
  the database."
  [params]
  (let [params (-> params
                   (assoc :published_at (-> params :published_at from-string to-timestamp))
                   (select-keys [:name :tag_name :published_at :body]))]
    (jdbc/insert! db-spec :repositories params)))

(defn get-repos
  "Gets the repository with the `repo-id`.
  If `repo-id` was not supplied, returns 
  all repos."
  ([]
   (jdbc/query db-spec ["SELECT * FROM repositories"]))
  ([repo-id]
   (first (jdbc/query db-spec ["SELECT * FROM repositories WHERE id = ?" (Integer/parseInt repo-id)]))))

(defn mark-seen!
  "Marks a repository in the database as 
  seen."
  [repo-id]
  (jdbc/update! db-spec :repositories {:seen_state true} ["id = ?" (Integer/parseInt repo-id)]))

