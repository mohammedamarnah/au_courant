(ns au-courant.routes
  (:require [compojure.core :refer [defroutes GET POST DELETE PUT]]
            [ring.middleware.keyword-params :refer [wrap-keyword-params]]
            [ring.middleware.params :refer [wrap-params]]
            [ring.middleware.cors :refer [wrap-cors]]
            [compojure.handler :refer [api]]
            [pjson.core :refer [write-str]]
            [au-courant.repos-controller :as rc]
            [compojure.route :as route]
            [au-courant.auth :as auth]
            [au-courant.db :as db]))

(defroutes app-routes
  (GET "/generate-token"
    {params :params}
    []
    (-> (auth/generate-token params) write-str))

  (POST "/add-user"
    {params :params}
    []
    (let [user (db/add-user! params)]
      (-> (auth/generate-token user true) write-str)))

  (GET "/repos"
    []
    (-> (rc/repos) write-str))

  (GET "/repos/:repo-name"
    [repo-name]
    (-> (rc/repos repo-name) write-str))

  (POST "/add-repo"
    {params :params}
    []
    (-> (rc/add-repo params) write-str))

  (DELETE "/repos/:repo-name/delete"
    [repo-name]
    (-> (rc/remove-repo repo-name) write-str))

  (PUT "/repos/:repo-name/update"
    [repo-name]
    (-> (rc/update-repo repo-name) write-str))

  (PUT "/refresh-repos"
    []
    (-> (rc/refresh-repos) write-str))

  (PUT "/mark-seen/:repo-name"
    [repo-name]
    (-> (rc/mark-seen repo-name) write-str))

  (route/resources "/")
  (route/not-found (write-str {:status 404 :body "Not Found"})))

(def app (-> app-routes
             (wrap-params)
             (wrap-keyword-params)
             (api)
             (wrap-cors :access-control-allow-origin [#".*"]
                        :access-control-allow-methods [:get :put :post :delete])))

