(ns au-courant.auth
  (:require [pjson.core :refer [write-str]]
            [buddy.sign.jwt :as jwt]
            [au-courant.db :as db]))

(defonce secret (System/getenv "SECRET"))

(defn generate-token
  [params & created?]
  (let [name (:name params)
        password (:password params)
        credentials (select-keys (db/get-user name) [:name :password])
        user {:name name :password password}
        status (if created? 201 200)]
    (write-str
     (if (= user credentials)
       {:status status :token (jwt/sign {:user name} secret)}
       {:status 403 :token ""}))))

(defn unsign-token
  [token]
  (jwt/unsign token secret))

