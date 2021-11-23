(defproject au_courant "0.1.0-SNAPSHOT"
  :description "FIXME: write description"
  :url "http://example.com/FIXME"
  :license {:name "EPL-2.0 OR GPL-2.0-or-later WITH Classpath-exception-2.0"
            :url "https://www.eclipse.org/legal/epl-2.0/"}
  :dependencies [[org.clojure/clojure "1.10.3"]
                 [clj-postgresql "0.7.0"]
                 [org.clojure/java.jdbc "0.6.0"]
                 [ring/ring-jetty-adapter "1.5.1"]
                 [compojure "1.6.2"]
                 [clj-http "3.12.3"]
                 [pjson "0.5.2"]
                 [ring-cors "0.1.13"]
                 [clj-time "0.15.2"]
                 [lein-shell "0.5.0"]]
  :main au-courant.core
  :plugins [[lein-ring "0.7.1"]]
  :ring {:handler au-courant.handler/app}
  :aliases {"native"
            ["shell"
             "native-image" "--report-unsupported-elements-at-runtime"
             "--initialize-at-build-time" "--no-server"
             "-jar" "./target/${:uberjar-name:-${:name}-${:version}-standalone.jar}"
             "-H:Name=./target/${:name}"]}
  :repl-options {:init-ns au-courant.core})
