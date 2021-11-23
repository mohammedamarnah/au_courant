(ns au-courant.repo-handler
  (:require [clojure.walk :refer [keywordize-keys]]
            [pjson.core :refer [read-str write-str]]
            [clj-http.client :as client]
            [au-courant.db :as db]))

(defn all-repos
  []
  (write-str {:status 200
              :repositories (db/get-repos)}))

(defn repos
  [repo-id]
  {:status 200
   :repositories (db/get-repos repo-id)})

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
    {:status 201}))

(defn mark-seen
  [repo-id]
  (db/mark-seen! repo-id)
  {:status 200})

