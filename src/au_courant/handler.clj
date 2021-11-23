(ns au-courant.handler
  (:require [compojure.core :refer [defroutes GET POST]]
            [compojure.handler :refer [api]]
            [ring.middleware.cors :refer [wrap-cors]]
            [au-courant.repo-handler :as rh]
            [compojure.route :as route]))

(defroutes app-routes
  (GET "/all-repos"
    []
    (rh/all-repos))

  (GET "/repos/:repo-id"
    [repo-id]
    (rh/repos repo-id))

  (POST "/add-repo"
    {params :params}
    []
    (rh/add-repo params))

  (POST "/mark-seen/:repo-id"
    [repo-id]
    (rh/mark-seen repo-id))

  (route/resources "/")
  (route/not-found {:status 404 :body "Not Found"}))

(def app (-> app-routes api (wrap-cors :access-control-allow-origin [#".*"]
                                       :access-control-allow-methods [:get :put :post :delete])))

