```console
$ kubectl apply -k github.com/fluxcd/flagger/kustomize/linkerd

customresourcedefinition.apiextensions.k8s.io/alertproviders.flagger.app created
customresourcedefinition.apiextensions.k8s.io/canaries.flagger.app created
customresourcedefinition.apiextensions.k8s.io/metrictemplates.flagger.app create                                                              d
serviceaccount/flagger created
clusterrole.rbac.authorization.k8s.io/flagger created
clusterrolebinding.rbac.authorization.k8s.io/flagger created
deployment.apps/flagger created

$ kubectl -n linkerd rollout status deploy/flagger

deployment "flagger" successfully rolled out

$ kubectl create ns test && kubectl apply -f https://run.linkerd.io/flagger.yml

namespace/test created
deployment.apps/load created
configmap/frontend created
deployment.apps/frontend created
service/frontend created
deployment.apps/podinfo created
service/podinfo created

$ kubectl -n test rollout status deploy podinfo

Waiting for deployment "podinfo" rollout to finish: 0 of 1 updated replicas are                                                               available...
deployment "podinfo" successfully rolled out

$ kubectl -n test port-forward svc/frontend 8080

Forwarding from 127.0.0.1:8080 -> 8080
Forwarding from [::1]:8080 -> 8080
Handling connection for 8080
Handling connection for 8080
Handling connection for 8080


$ cat <<EOF | kubectl apply -f -
> apiVersion: flagger.app/v1beta1
> kind: Canary
> metadata:
>   name: podinfo
>   namespace: test
> spec:
>   targetRef:
>     apiVersion: apps/v1
>     kind: Deployment
>     name: podinfo
>   service:
>     port: 9898
>   analysis:
>     interval: 10s
>     threshold: 5
>     stepWeight: 10
>     maxWeight: 100
>     metrics:
>     - name: request-success-rate
>       thresholdRange:
>         min: 99
>       interval: 1m
>     - name: request-duration
>       thresholdRange:
>         max: 500
>       interval: 1m
> EOF
canary.flagger.app/podinfo created

$ kubectl -n test get ev --watch

LAST SEEN   TYPE      REASON                  OBJECT                                                                                                MESSAGE
119s        Normal    ScalingReplicaSet       deployment/load                                                                                       Scaled up replica set load-768757778c to 1
119s        Normal    Injected                deployment/load                                                                                       Linkerd sidecar proxy injected
119s        Normal    SuccessfulCreate        replicaset/load-768757778c                                                                            Created pod: load-768757778c-nmg5x
119s        Normal    ScalingReplicaSet       deployment/frontend                                                                                   Scaled up replica set frontend-95b98cf55 to 1
119s        Normal    Injected                deployment/frontend                                                                                   Linkerd sidecar proxy injected
118s        Normal    Scheduled               pod/load-768757778c-nmg5x                                                                             Successfully assigned test/load-768757778c-nmg5x to k3d-k3s-default-agent-                                                              0
119s        Normal    SuccessfulCreate        replicaset/frontend-95b98cf55                                                                         Created pod: frontend-95b98cf55-wf86n
118s        Normal    Scheduled               pod/frontend-95b98cf55-wf86n                                                                          Successfully assigned test/frontend-95b98cf55-wf86n to k3d-k3s-default-ser                                                              ver-0
118s        Normal    ScalingReplicaSet       deployment/podinfo                                                                                    Scaled up replica set podinfo-7db9b7744c to 1
118s        Normal    Injected                deployment/podinfo                                                                                    Linkerd sidecar proxy injected
118s        Normal    SuccessfulCreate        replicaset/podinfo-7db9b7744c                                                                         Created pod: podinfo-7db9b7744c-s8lpd
117s        Normal    Scheduled               pod/podinfo-7db9b7744c-s8lpd                                                                          Successfully assigned test/podinfo-7db9b7744c-s8lpd to k3d-k3s-default-age                                                              nt-0
117s        Normal    Pulled                  pod/load-768757778c-nmg5x                                                                             Container image "cr.l5d.io/linkerd/proxy-init:v1.5.3" already present on m                                                              achine
117s        Normal    Pulled                  pod/frontend-95b98cf55-wf86n                                                                          Container image "cr.l5d.io/linkerd/proxy-init:v1.5.3" already present on m                                                              achine
116s        Normal    Pulled                  pod/podinfo-7db9b7744c-s8lpd                                                                          Container image "cr.l5d.io/linkerd/proxy-init:v1.5.3" already present on m                                                              achine
116s        Normal    Created                 pod/load-768757778c-nmg5x                                                                             Created container linkerd-init
116s        Normal    Created                 pod/frontend-95b98cf55-wf86n                                                                          Created container linkerd-init
116s        Normal    Created                 pod/podinfo-7db9b7744c-s8lpd                                                                          Created container linkerd-init
116s        Normal    Started                 pod/frontend-95b98cf55-wf86n                                                                          Started container linkerd-init
116s        Normal    Started                 pod/load-768757778c-nmg5x                                                                             Started container linkerd-init
116s        Normal    Started                 pod/podinfo-7db9b7744c-s8lpd                                                                          Started container linkerd-init
114s        Normal    Pulled                  pod/load-768757778c-nmg5x                                                                             Container image "cr.l5d.io/linkerd/proxy:stable-2.11.4" already present on                                                               machine
114s        Normal    Pulled                  pod/podinfo-7db9b7744c-s8lpd                                                                          Container image "cr.l5d.io/linkerd/proxy:stable-2.11.4" already present on                                                               machine
114s        Normal    Pulled                  pod/frontend-95b98cf55-wf86n                                                                          Container image "cr.l5d.io/linkerd/proxy:stable-2.11.4" already present on                                                               machine
113s        Normal    Created                 pod/load-768757778c-nmg5x                                                                             Created container linkerd-proxy
113s        Normal    Created                 pod/podinfo-7db9b7744c-s8lpd                                                                          Created container linkerd-proxy
113s        Normal    Created                 pod/frontend-95b98cf55-wf86n                                                                          Created container linkerd-proxy
113s        Normal    Started                 pod/load-768757778c-nmg5x                                                                             Started container linkerd-proxy
113s        Normal    IssuedLeafCertificate   serviceaccount/default                                                                                issued certificate for default.test.serviceaccount.identity.linkerd.cluste                                                              r.local until 2022-07-25 11:49:03 +0000 UTC: d383874e22d01342564c6981e76b4f6e
113s        Normal    Started                 pod/podinfo-7db9b7744c-s8lpd                                                                          Started container linkerd-proxy
113s        Normal    IssuedLeafCertificate   serviceaccount/default                                                                                issued certificate for default.test.serviceaccount.identity.linkerd.cluste                                                              r.local until 2022-07-25 11:49:03 +0000 UTC: d3f762d5638f961d4e27f830efb53adc
113s        Normal    Pulling                 pod/load-768757778c-nmg5x                                                                             Pulling image "buoyantio/slow_cooker:1.2.0"
113s        Normal    Pulling                 pod/podinfo-7db9b7744c-s8lpd                                                                          Pulling image "quay.io/stefanprodan/podinfo:1.7.0"
112s        Normal    IssuedLeafCertificate   serviceaccount/default                                                                                issued certificate for default.test.serviceaccount.identity.linkerd.cluste                                                              r.local until 2022-07-25 11:49:04 +0000 UTC: de96bf1c629a5443a3e2031d4d4958cf
112s        Normal    Started                 pod/frontend-95b98cf55-wf86n                                                                          Started container linkerd-proxy
112s        Normal    Pulling                 pod/frontend-95b98cf55-wf86n                                                                          Pulling image "nginx:alpine"
98s         Normal    Pulled                  pod/load-768757778c-nmg5x                                                                             Successfully pulled image "buoyantio/slow_cooker:1.2.0" in 14.105536s
98s         Normal    Created                 pod/load-768757778c-nmg5x                                                                             Created container slow-cooker
97s         Normal    Pulled                  pod/podinfo-7db9b7744c-s8lpd                                                                          Successfully pulled image "quay.io/stefanprodan/podinfo:1.7.0" in 15.03078                                                              8s
97s         Normal    Started                 pod/load-768757778c-nmg5x                                                                             Started container slow-cooker
97s         Normal    Created                 pod/podinfo-7db9b7744c-s8lpd                                                                          Created container podinfod
97s         Normal    Started                 pod/podinfo-7db9b7744c-s8lpd                                                                          Started container podinfod
96s         Normal    Pulled                  pod/frontend-95b98cf55-wf86n                                                                          Successfully pulled image "nginx:alpine" in 16.1715855s
96s         Normal    Created                 pod/frontend-95b98cf55-wf86n                                                                          Created container nginx
95s         Normal    Started                 pod/frontend-95b98cf55-wf86n                                                                          Started container nginx
5s          Normal    Synced                  canary/podinfo                                                                                        all the metrics providers are available!
5s          Warning   Synced                  canary/podinfo                                                                                        podinfo-primary.test not ready: waiting for rollout to finish: observed de                                                              ployment generation less than desired generation
5s          Normal    ScalingReplicaSet       deployment/podinfo-primary                                                                            Scaled up replica set podinfo-primary-75f467d998 to 1
5s          Normal    Injected                deployment/podinfo-primary                                                                            Linkerd sidecar proxy injected
5s          Normal    SuccessfulCreate        replicaset/podinfo-primary-75f467d                                                              998   Created pod: podinfo-primary-75f467d998-lx6p5
4s          Normal    Scheduled               pod/podinfo-primary-75f467d998-lx6                                                              p5    Successfully assigned test/podinfo-primary-75f467d998-lx6p5 to k3d-k3s-def                                                              ault-server-0
4s          Normal    Pulled                  pod/podinfo-primary-75f467d998-lx6                                                              p5    Container image "cr.l5d.io/linkerd/proxy-init:v1.5.3" already present on m                                                              achine
4s          Normal    Created                 pod/podinfo-primary-75f467d998-lx6                                                              p5    Created container linkerd-init
4s          Normal    Started                 pod/podinfo-primary-75f467d998-lx6                                                              p5    Started container linkerd-init
3s          Normal    Pulled                  pod/podinfo-primary-75f467d998-lx6                                                              p5    Container image "cr.l5d.io/linkerd/proxy:stable-2.11.4" already present on                                                               machine
2s          Normal    Created                 pod/podinfo-primary-75f467d998-lx6                                                              p5    Created container linkerd-proxy
2s          Normal    Started                 pod/podinfo-primary-75f467d998-lx6                                                              p5    Started container linkerd-proxy
2s          Normal    IssuedLeafCertificate   serviceaccount/default                                                                                issued certificate for default.test.serviceaccount.identity.linkerd.cluste                                                              r.local until 2022-07-25 11:50:54 +0000 UTC: 20c536ef5d71e011f4ce6428925d9d42
2s          Normal    Pulling                 pod/podinfo-primary-75f467d998-lx6                                                              p5    Pulling image "quay.io/stefanprodan/podinfo:1.7.0"
0s          Normal    Synced                  canary/podinfo                                                                                        all the metrics providers are available!
0s          Warning   Synced                  canary/podinfo                                                                                        podinfo-primary.test not ready: waiting for rollout to finish: 0 of 1 (rea                                                              dyThreshold 100%) updated replicas are available
0s          Normal    Pulled                  pod/podinfo-primary-75f467d998-lx6                                                              p5    Successfully pulled image "quay.io/stefanprodan/podinfo:1.7.0" in 8.169358                                                              2s
0s          Normal    Created                 pod/podinfo-primary-75f467d998-lx6                                                              p5    Created container podinfod
0s          Normal    Started                 pod/podinfo-primary-75f467d998-lx6                                                              p5    Started container podinfod
0s          Normal    Synced                  canary/podinfo                                                                                        all the metrics providers are available!
0s          Normal    ScalingReplicaSet       deployment/podinfo                                                                                    Scaled down replica set podinfo-7db9b7744c to 0
0s          Normal    SuccessfulDelete        replicaset/podinfo-7db9b7744c                                                                         Deleted pod: podinfo-7db9b7744c-s8lpd
0s          Normal    Killing                 pod/podinfo-7db9b7744c-s8lpd                                                                          Stopping container linkerd-proxy
0s          Normal    Killing                 pod/podinfo-7db9b7744c-s8lpd                                                                          Stopping container podinfod
0s          Normal    Synced                  canary/podinfo                                                                                        Initialization done! podinfo.test
0s          Normal    Created                 trafficsplit/podinfo                                                                                  Created Service Profile podinfo.test.svc.cluster.local

$ kubectl -n test get svc

NAME              TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)    AGE
frontend          ClusterIP   10.43.237.234   <none>        8080/TCP   3m54s
podinfo-canary    ClusterIP   10.43.5.197     <none>        9898/TCP   2m
podinfo-primary   ClusterIP   10.43.185.154   <none>        9898/TCP   2m
podinfo           ClusterIP   10.43.47.128    <none>        9898/TCP   3m53s

$ kubectl -n test set image deployment/podinfo podinfod=quay.io/stefanprodan/podinfo:1.7.1
  
deployment.apps/podinfo image updated

$ kubectl -n test get ev --watch

LAST SEEN   TYPE      REASON                  OBJECT                                  MESSAGE
5m21s       Normal    ScalingReplicaSet       deployment/load                         Scaled up replica set load-768757778c to                 1
5m21s       Normal    Injected                deployment/load                         Linkerd sidecar proxy injected
5m21s       Normal    SuccessfulCreate        replicaset/load-768757778c              Created pod: load-768757778c-nmg5x
5m21s       Normal    ScalingReplicaSet       deployment/frontend                     Scaled up replica set frontend-95b98cf55                 to 1
5m21s       Normal    Injected                deployment/frontend                     Linkerd sidecar proxy injected
5m20s       Normal    Scheduled               pod/load-768757778c-nmg5x               Successfully assigned test/load-76875777                8c-nmg5x to k3d-k3s-default-agent-0
5m21s       Normal    SuccessfulCreate        replicaset/frontend-95b98cf55           Created pod: frontend-95b98cf55-wf86n
5m20s       Normal    Scheduled               pod/frontend-95b98cf55-wf86n            Successfully assigned test/frontend-95b9                8cf55-wf86n to k3d-k3s-default-server-0
5m20s       Normal    ScalingReplicaSet       deployment/podinfo                      Scaled up replica set podinfo-7db9b7744c                 to 1
5m20s       Normal    SuccessfulCreate        replicaset/podinfo-7db9b7744c           Created pod: podinfo-7db9b7744c-s8lpd
5m19s       Normal    Scheduled               pod/podinfo-7db9b7744c-s8lpd            Successfully assigned test/podinfo-7db9b                7744c-s8lpd to k3d-k3s-default-agent-0
5m19s       Normal    Pulled                  pod/load-768757778c-nmg5x               Container image "cr.l5d.io/linkerd/proxy                -init:v1.5.3" already present on machine
5m19s       Normal    Pulled                  pod/frontend-95b98cf55-wf86n            Container image "cr.l5d.io/linkerd/proxy                -init:v1.5.3" already present on machine
5m18s       Normal    Pulled                  pod/podinfo-7db9b7744c-s8lpd            Container image "cr.l5d.io/linkerd/proxy                -init:v1.5.3" already present on machine
5m18s       Normal    Created                 pod/load-768757778c-nmg5x               Created container linkerd-init
5m18s       Normal    Created                 pod/frontend-95b98cf55-wf86n            Created container linkerd-init
5m18s       Normal    Created                 pod/podinfo-7db9b7744c-s8lpd            Created container linkerd-init
5m18s       Normal    Started                 pod/frontend-95b98cf55-wf86n            Started container linkerd-init
5m18s       Normal    Started                 pod/load-768757778c-nmg5x               Started container linkerd-init
5m18s       Normal    Started                 pod/podinfo-7db9b7744c-s8lpd            Started container linkerd-init
5m16s       Normal    Pulled                  pod/load-768757778c-nmg5x               Container image "cr.l5d.io/linkerd/proxy                :stable-2.11.4" already present on machine
5m16s       Normal    Pulled                  pod/podinfo-7db9b7744c-s8lpd            Container image "cr.l5d.io/linkerd/proxy                :stable-2.11.4" already present on machine
5m16s       Normal    Pulled                  pod/frontend-95b98cf55-wf86n            Container image "cr.l5d.io/linkerd/proxy                :stable-2.11.4" already present on machine
5m15s       Normal    Created                 pod/load-768757778c-nmg5x               Created container linkerd-proxy
5m15s       Normal    Created                 pod/podinfo-7db9b7744c-s8lpd            Created container linkerd-proxy
5m15s       Normal    Created                 pod/frontend-95b98cf55-wf86n            Created container linkerd-proxy
5m15s       Normal    Started                 pod/load-768757778c-nmg5x               Started container linkerd-proxy
5m15s       Normal    IssuedLeafCertificate   serviceaccount/default                  issued certificate for default.test.serv                iceaccount.identity.linkerd.cluster.local until 2022-07-25 11:49:03 +0000 UTC: d383874e22d01342564c6981e76b4f6e
5m15s       Normal    Started                 pod/podinfo-7db9b7744c-s8lpd            Started container linkerd-proxy
5m15s       Normal    IssuedLeafCertificate   serviceaccount/default                  issued certificate for default.test.serv                iceaccount.identity.linkerd.cluster.local until 2022-07-25 11:49:03 +0000 UTC: d3f762d5638f961d4e27f830efb53adc
5m15s       Normal    Pulling                 pod/load-768757778c-nmg5x               Pulling image "buoyantio/slow_cooker:1.2                .0"
5m15s       Normal    Pulling                 pod/podinfo-7db9b7744c-s8lpd            Pulling image "quay.io/stefanprodan/podi                nfo:1.7.0"
5m14s       Normal    IssuedLeafCertificate   serviceaccount/default                  issued certificate for default.test.serv                iceaccount.identity.linkerd.cluster.local until 2022-07-25 11:49:04 +0000 UTC: de96bf1c629a5443a3e2031d4d4958cf
5m14s       Normal    Started                 pod/frontend-95b98cf55-wf86n            Started container linkerd-proxy
5m14s       Normal    Pulling                 pod/frontend-95b98cf55-wf86n            Pulling image "nginx:alpine"
5m          Normal    Pulled                  pod/load-768757778c-nmg5x               Successfully pulled image "buoyantio/slo                w_cooker:1.2.0" in 14.105536s
5m          Normal    Created                 pod/load-768757778c-nmg5x               Created container slow-cooker
4m59s       Normal    Pulled                  pod/podinfo-7db9b7744c-s8lpd            Successfully pulled image "quay.io/stefa                nprodan/podinfo:1.7.0" in 15.030788s
4m59s       Normal    Started                 pod/load-768757778c-nmg5x               Started container slow-cooker
4m59s       Normal    Created                 pod/podinfo-7db9b7744c-s8lpd            Created container podinfod
4m59s       Normal    Started                 pod/podinfo-7db9b7744c-s8lpd            Started container podinfod
4m58s       Normal    Pulled                  pod/frontend-95b98cf55-wf86n            Successfully pulled image "nginx:alpine"                 in 16.1715855s
4m58s       Normal    Created                 pod/frontend-95b98cf55-wf86n            Created container nginx
4m57s       Normal    Started                 pod/frontend-95b98cf55-wf86n            Started container nginx
3m27s       Warning   Synced                  canary/podinfo                          podinfo-primary.test not ready: waiting                 for rollout to finish: observed deployment generation less than desired generation
3m27s       Normal    ScalingReplicaSet       deployment/podinfo-primary              Scaled up replica set podinfo-primary-75                f467d998 to 1
3m27s       Normal    Injected                deployment/podinfo-primary              Linkerd sidecar proxy injected
3m27s       Normal    SuccessfulCreate        replicaset/podinfo-primary-75f467d998   Created pod: podinfo-primary-75f467d998-                lx6p5
3m27s       Normal    Scheduled               pod/podinfo-primary-75f467d998-lx6p5    Successfully assigned test/podinfo-prima                ry-75f467d998-lx6p5 to k3d-k3s-default-server-0
3m26s       Normal    Pulled                  pod/podinfo-primary-75f467d998-lx6p5    Container image "cr.l5d.io/linkerd/proxy                -init:v1.5.3" already present on machine
3m26s       Normal    Created                 pod/podinfo-primary-75f467d998-lx6p5    Created container linkerd-init
3m26s       Normal    Started                 pod/podinfo-primary-75f467d998-lx6p5    Started container linkerd-init
3m25s       Normal    Pulled                  pod/podinfo-primary-75f467d998-lx6p5    Container image "cr.l5d.io/linkerd/proxy                :stable-2.11.4" already present on machine
3m24s       Normal    Created                 pod/podinfo-primary-75f467d998-lx6p5    Created container linkerd-proxy
3m24s       Normal    Started                 pod/podinfo-primary-75f467d998-lx6p5    Started container linkerd-proxy
3m24s       Normal    IssuedLeafCertificate   serviceaccount/default                  issued certificate for default.test.serv                iceaccount.identity.linkerd.cluster.local until 2022-07-25 11:50:54 +0000 UTC: 20c536ef5d71e011f4ce6428925d9d42
3m24s       Normal    Pulling                 pod/podinfo-primary-75f467d998-lx6p5    Pulling image "quay.io/stefanprodan/podi                nfo:1.7.0"
3m17s       Warning   Synced                  canary/podinfo                          podinfo-primary.test not ready: waiting                 for rollout to finish: 0 of 1 (readyThreshold 100%) updated replicas are available
3m16s       Normal    Pulled                  pod/podinfo-primary-75f467d998-lx6p5    Successfully pulled image "quay.io/stefa                nprodan/podinfo:1.7.0" in 8.1693582s
3m15s       Normal    Created                 pod/podinfo-primary-75f467d998-lx6p5    Created container podinfod
3m15s       Normal    Started                 pod/podinfo-primary-75f467d998-lx6p5    Started container podinfod
3m7s        Normal    Synced                  canary/podinfo                          all the metrics providers are available!
3m7s        Normal    ScalingReplicaSet       deployment/podinfo                      Scaled down replica set podinfo-7db9b774                4c to 0
3m7s        Normal    SuccessfulDelete        replicaset/podinfo-7db9b7744c           Deleted pod: podinfo-7db9b7744c-s8lpd
3m7s        Normal    Killing                 pod/podinfo-7db9b7744c-s8lpd            Stopping container linkerd-proxy
3m7s        Normal    Killing                 pod/podinfo-7db9b7744c-s8lpd            Stopping container podinfod
3m7s        Normal    Synced                  canary/podinfo                          Initialization done! podinfo.test
3m6s        Normal    Created                 trafficsplit/podinfo                    Created Service Profile podinfo.test.svc                .cluster.local
17s         Normal    Synced                  canary/podinfo                          New revision detected! Scaling up podinf                o.test
17s         Normal    ScalingReplicaSet       deployment/podinfo                      Scaled up replica set podinfo-5696d5d46d                 to 1
17s         Normal    Injected                deployment/podinfo                      Linkerd sidecar proxy injected
17s         Normal    SuccessfulCreate        replicaset/podinfo-5696d5d46d           Created pod: podinfo-5696d5d46d-nqhzc
17s         Normal    Scheduled               pod/podinfo-5696d5d46d-nqhzc            Successfully assigned test/podinfo-5696d                5d46d-nqhzc to k3d-k3s-default-agent-0
16s         Normal    Pulled                  pod/podinfo-5696d5d46d-nqhzc            Container image "cr.l5d.io/linkerd/proxy                -init:v1.5.3" already present on machine
16s         Normal    Created                 pod/podinfo-5696d5d46d-nqhzc            Created container linkerd-init
16s         Normal    Started                 pod/podinfo-5696d5d46d-nqhzc            Started container linkerd-init
15s         Normal    Pulled                  pod/podinfo-5696d5d46d-nqhzc            Container image "cr.l5d.io/linkerd/proxy                :stable-2.11.4" already present on machine
15s         Normal    Created                 pod/podinfo-5696d5d46d-nqhzc            Created container linkerd-proxy
14s         Normal    IssuedLeafCertificate   serviceaccount/default                  issued certificate for default.test.serv                iceaccount.identity.linkerd.cluster.local until 2022-07-25 11:54:04 +0000 UTC: 225b56aa4a9cfb3a5682bfc77122a9b2
14s         Normal    Started                 pod/podinfo-5696d5d46d-nqhzc            Started container linkerd-proxy
14s         Normal    Pulling                 pod/podinfo-5696d5d46d-nqhzc            Pulling image "quay.io/stefanprodan/podi                nfo:1.7.1"
7s          Warning   Synced                  canary/podinfo                          canary deployment podinfo.test not ready                : waiting for rollout to finish: 0 of 1 (readyThreshold 100%) updated replicas are available
5s          Normal    Pulled                  pod/podinfo-5696d5d46d-nqhzc            Successfully pulled image "quay.io/stefa                nprodan/podinfo:1.7.1" in 9.0779698s
5s          Normal    Created                 pod/podinfo-5696d5d46d-nqhzc            Created container podinfod
5s          Normal    Started                 pod/podinfo-5696d5d46d-nqhzc            Started container podinfod
0s          Normal    Synced                  canary/podinfo                          Starting canary analysis for podinfo.tes                t
0s          Normal    Synced                  canary/podinfo                          Advance podinfo.test canary weight 10
0s          Normal    Updated                 trafficsplit/podinfo                    Updated Service Profile podinfo.test.svc                .cluster.local
0s          Normal    Synced                  canary/podinfo                          Advance podinfo.test canary weight 20
0s          Normal    Updated                 trafficsplit/podinfo                    Updated Service Profile podinfo.test.svc                .cluster.local
0s          Normal    Synced                  canary/podinfo                          Advance podinfo.test canary weight 30
0s          Normal    Updated                 trafficsplit/podinfo                    Updated Service Profile podinfo.test.svc                .cluster.local
0s          Normal    Synced                  canary/podinfo                          Advance podinfo.test canary weight 40
0s          Normal    Updated                 trafficsplit/podinfo                    Updated Service Profile podinfo.test.svc.cluster.local
0s          Normal    Synced                  canary/podinfo                          Advance podinfo.test canary weight 50
0s          Normal    Updated                 trafficsplit/podinfo                    Updated Service Profile podinfo.test.svc.cluster.local


$ kubectl -n test get canary

NAME      STATUS      WEIGHT   LASTTRANSITIONTIME
podinfo   Succeeded   0        2022-07-24T11:56:11Z

$ kubectl -n test get trafficsplit podinfo -o yaml

apiVersion: split.smi-spec.io/v1alpha2
kind: TrafficSplit
metadata:
  creationTimestamp: "2022-07-24T11:50:51Z"
  generation: 11
  name: podinfo
  namespace: test
  ownerReferences:
  - apiVersion: flagger.app/v1beta1
    blockOwnerDeletion: true
    controller: true
    kind: Canary
    name: podinfo
    uid: 2866a4e3-5e0a-47e9-8029-ac0ce954833f
  resourceVersion: "2595"
  uid: 08beb5e4-f5b1-48ad-bc8c-8861d06e4ce9
spec:
  backends:
  - service: podinfo-canary
    weight: "100"
  - service: podinfo-primary
    weight: "0"
  service: podinfo

$ linkerd viz -n test stat deploy --from deploy/load
NAME              MESHED   SUCCESS       RPS   LATENCY_P50   LATENCY_P95   LATENCY_P99   TCP_CONN
podinfo              0/0         -         -             -             -             -          -
podinfo-primary      1/1   100.00%   10.0rps           2ms           5ms           5ms          1

$ linkerd viz dashboard
Linkerd dashboard available at:
http://localhost:50750
Grafana dashboard available at:
http://localhost:50750/grafana
Opening Linkerd dashboard in the default browser


Kakubectl -n test port-forward svc/frontend 8080
Forwarding from 127.0.0.1:8080 -> 8080
Forwarding from [::1]:8080 -> 8080
Handling connection for 8080
Handling connection for 8080
Handling connection for 8080
Handling connection for 8080
Handling connection for 8080


$ kubectl delete -k github.com/fluxcd/flagger/kustomize/linkerd && kubectl delete ns test
  
customresourcedefinition.apiextensions.k8s.io "alertproviders.flagger.app" deleted
customresourcedefinition.apiextensions.k8s.io "canaries.flagger.app" deleted
customresourcedefinition.apiextensions.k8s.io "metrictemplates.flagger.app" deleted
serviceaccount "flagger" deleted
clusterrole.rbac.authorization.k8s.io "flagger" deleted
clusterrolebinding.rbac.authorization.k8s.io "flagger" deleted
deployment.apps "flagger" deleted
namespace "test" deleted

```