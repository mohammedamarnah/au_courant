(ns au-courant.repos-controller
  (:require [clj-time.coerce :refer [from-string to-timestamp from-date]]
            [clojure.walk :refer [keywordize-keys]]
            [clj-time.core :refer [after? before?]]
            [pjson.core :refer [read-str]]
            [clj-http.client :as client]
            [au-courant.db :as db]))

(defn- latest-release
  [owner repo]
  (let [headers {"Accept" "application/vnd.github.v3+json"}
        base-url "https://api.github.com/repos/"
        repo-url (str base-url owner "/" repo "/releases")]
    (-> repo-url
        (client/get {:headers headers})
        :body
        read-str
        keywordize-keys
        (->> (sort-by :published_at)
             last))))

;; TODO: check for error responses from github and send them back.

(defn repos
  ([]
   {:status 200
    :repositories (db/get-repos)})
  ([repo-name]
   {:status 200
    :repositories (db/get-repos repo-name)}))

(defn add-repo
  [{owner :owner repo-name :repo_name :as params}]
  (let [repo-info (-> (latest-release owner repo-name)
                      (select-keys [:name :tag_name :body :published_at]))
        formatted-time (-> repo-info
                           :published_at
                           from-string
                           to-timestamp)
        repo-info (assoc repo-info :published_at formatted-time)]
    (db/add-repo! (merge repo-info params))
    {:status 201
     :repositories (db/get-repos)}))

(defn remove-repo
  [repo-name]
  (db/remove-repo! repo-name)
  {:status 200
   :repositories (db/get-repos)})

(defn is-outdated?
  [old-repo new-repo]
  (let [old-date (-> old-repo :published_at from-date)
        new-date (-> new-repo :published_at from-string)]
    (or
     (after? new-date old-date)
     (before? new-date old-date))))

(defn merge-repos
  [old-repo new-repo]
  (let [new-date (-> new-repo :published_at from-string)]
    (merge
     (select-keys new-repo [:name :tag_name :body :published_at])
     (select-keys old-repo [:owner :repo_name])
     {:published_at (to-timestamp new-date)})))

(defn update-repo
  [repo-name]
  (let [repo-info (db/get-repos repo-name)
        requested-repo (latest-release (:owner repo-info) (:repo_name repo-info))]
    (if (is-outdated? repo-info requested-repo)
      (do
        (db/update-repo! (merge-repos repo-info requested-repo))
        {:status 200
         :repositories (db/get-repos)})
      {:status 304})))

(defn refresh-repo
  [repo]
  (let [requested-repo (latest-release (:owner repo) (:repo_name repo))]
    (if (is-outdated? repo requested-repo)
      (let [new-repo (merge (merge-repos repo requested-repo)
                            {:seen_state false})]
        (db/update-repo! new-repo)
        new-repo)
      repo)))

(defn refresh-repos
  []
  (let [repos (map refresh-repo (db/get-repos))]
    {:status 200
     :repositories repos}))

(defn mark-seen
  [repo-name]
  (db/mark-seen! repo-name)
  {:status 200
   :repositories (db/get-repos)})

