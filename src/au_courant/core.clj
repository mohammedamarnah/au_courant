(ns au-courant.core
  (:require [ring.adapter.jetty :as jetty]
            [au-courant.handler :refer [app]])
  (:gen-class))

(defn -main
  [& [port]]
  (let [port (Integer. (or port
                           (System/getenv "PORT")
                           4432))]
    (jetty/run-jetty #'app {:port  port})))

