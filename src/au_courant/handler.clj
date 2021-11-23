(ns au-courant.handler
  (:require [compojure.core :refer [defroutes GET POST]]
            [compojure.handler :refer [api]]
            [ring.middleware.cors :refer [wrap-cors]]
            [au-courant.repo-handler :as rh]
            [compojure.route :as route]
            [au-courant.auth :as auth]
            [au-courant.db :as db]))

(defroutes app-routes
  (GET "/repos"
    []
    (rh/all-repos))

  (GET "/repos/:repo-id"
    [repo-id]
    (rh/repos repo-id))

  (GET "/generate-token"
    {params :params}
    []
    (auth/generate-token params))

  (POST "/add-user"
    {params :params}
    []
    (let [user (db/add-user! params)]
      (auth/generate-token user true)))

  (POST "/add-repo"
    {params :params}
    []
    (rh/add-repo params))

  (POST "/mark-seen/:repo-id"
    [repo-id]
    (rh/mark-seen repo-id))

  (route/resources "/")
  (route/not-found {:status 404 :body "Not Found"}))

(def app (-> app-routes
             api
             (wrap-cors :access-control-allow-origin [#".*"]
                        :access-control-allow-methods [:get :put :post :delete])))

