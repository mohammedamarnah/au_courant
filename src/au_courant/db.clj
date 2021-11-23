(ns au-courant.db
  (:require [clj-time.coerce :refer [from-string to-timestamp]]
            [clojure.walk :refer [keywordize-keys]]
            [pjson.core :refer [read-str]]
            [clj-postgresql.core :as pg]
            [clojure.java.jdbc :as jdbc]))

(def db (-> "config/db_config.json"
            slurp
            read-str
            keywordize-keys))

(def db-spec (pg/spec :host (:host db)
                      :user (:user db)
                      :password (:password db)
                      :dbname (:dbname db)))

(defn create-db!
  "creates the initial database."
  []
  (let [schema [[:id :serial "PRIMARY KEY"]
                [:name :text "NOT NULL"]
                [:tag_name :text "NOT NULL"]
                [:published_at :timestamp "NOT NULL"]
                [:seen_state :boolean "DEFAULT FALSE"]
                [:body :text]]]
    (jdbc/db-do-commands
     db-spec
     (jdbc/create-table-ddl :repositories schema))))

(defn add-repo!
  "stores the repository information into
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
   (jdbc/query db-spec ["SELECT * FROM repositories WHERE id = ?" repo-id])))

(defn mark-seen!
  "Marks a repository in the database as 
  seen."
  [repo-id]
  (jdbc/update! db-spec :repositories {:seen_state true} ["id = ?" repo-id]))

