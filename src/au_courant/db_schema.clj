(ns au-courant.db-schema
  (:require [clojure.walk :refer [keywordize-keys]]
            [pjson.core :refer [read-str]]
            [clj-postgresql.core :as pg]))

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
                       [:owner :text "NOT NULL"]
                       [:repo_name :text "UNIQUE NOT NULL"]
                       [:tag_name :text]
                       [:published_at :timestamp "NOT NULL"]
                       [:seen_state :boolean "DEFAULT TRUE"]
                       [:body :text]])

(defonce users-schema [[:id :serial "PRIMARY KEY"]
                       [:name :text "NOT NULL"]
                       [:password :text "NOT NULL"]])

