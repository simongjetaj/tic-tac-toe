# Tic Tac Toe Online Multiplayer Game

A multiplayer game on a client/server distributed model based on real-time event-driven architecture.
It uses Angular in the front-end, while in the back-end Socket.io with Node.js (Express.js server in combination with Typescript).

## How to run?

You can use the README file inside the projects to run the projects locally (and to understand how they better work).

### If you would like to run with Docker

### Prerequisites

https://docs.docker.com/compose/install/

1- Execute: `docker-compose up -d`. <br>
2- Navigate to 'http://localhost:4200'

---
### If you would like to run with Kubernetes
https://docs.docker.com/desktop/kubernetes/#enable-kubernetes

#### K8s manifest files
angular.yaml
socketio.yaml

1- Execute: `kubectl apply -f k8s` <br>
2- Navigate to 'http://localhost:30100'

#### Info
Get basic info about k8s components
```
kubectl get node
kubectl get pod
kubectl get svc
kubectl get all
```


Get extended info about components

```
kubectl get pod -o wide
kubectl get node -o wide
```


Get detailed info about a specific component

```
kubectl describe svc {svc-name}
kubectl describe pod {pod-name}
```


Get application logs

`kubectl logs {pod-name}`


Made with ❤️ by [@simongjetaj](https://linkedin.com/in/simongjetaj)
