(ns au-courant.db
  (:require [clj-time.coerce :refer [from-string to-date]]
            [clj-postgresql.core :as pg]
            [clojure.java.jdbc :as jdbc]))

(def db (pg/spec :host "localhost"
                 :user "mohammedamarnah"
                 :password ""
                 :dbname "mohammedamarnah"))

(defn create-db
  "creates the initial database."
  []
  (jdbc/db-do-commands db
                       (jdbc/create-table-ddl :repositories
                                              [[:id :serial "PRIMARY KEY"]
                                               [:name :text "NOT NULL"]
                                               [:tag_name :text "NOT NULL"]
                                               [:published_at :timestamp "NOT NULL"]
                                               [:seen_state :boolean "DEFAULT FALSE"]
                                               [:body :text]])))

(defn add-repo!
  "stores the repository information into
  the database."
  [params]
  (let [params (select-keys params [:name :tag_name :published_at :body])
        params (assoc params :published_at (-> params :published_at from-string to-date))]
    (jdbc/insert! db :repositories params)))

(defn get-repos
  "Gets the repository with the `repo-id`.
  If `repo-id` was not supplied, returns 
  all repos."
  ([]
   (jdbc/query db ["SELECT * FROM repositories"]))
  ([repo-id]
   (jdbc/query db ["SELECT * FROM repositories WHERE id = ?" repo-id])))

(defn mark-seen!
  "Marks a repository in the database as 
  seen."
  [repo-id]
  (jdbc/update! db :repositories {:seen_state true} ["id = ?" repo-id]))

