(ns au-courant.repo-handler
  (:require [pjson.core :refer [read-str write-str]]
            [clojure.walk :refer [keywordize-keys]]
            [clj-http.client :as client]
            [au-courant.db :as db]))

(defn all-repos
  []
  (write-str
   {:status 200
    :repositories (db/get-repos)}))

(defn repos
  [repo-id]
  (write-str
   {:status 200
    :repositories (db/get-repos repo-id)}))

(defn add-repo
  [{owner :owner repo :repo :as _}]
  (let [headers {"Accept" "application/vnd.github.v3+json"}
        base-url "https://api.github.com/repos/"
        repo-url (str base-url owner "/" repo "/releases")
        latest-version-info (-> repo-url
                                (client/get {:headers headers})
                                :body
                                read-str
                                keywordize-keys
                                first
                                (select-keys [:name :tag_name :body :published_at]))]
    (db/add-repo! latest-version-info)
    (write-str {:status 201
                :repositories (db/get-repos)})))

(defn mark-seen
  [repo-id]
  (db/mark-seen! repo-id)
  (write-str {:status 200
              :repositories (db/get-repos repo-id)}))

