# Benchmark

Trivial benchmark script to run against an endpoint.

```shell
$ go run hack/benchmark/main.go -h
  -duration duration
    	how long benchmark runs (default 1s)
  -every duration
    	interval between each request (default 1s)
  -method string
    	method for the request (default "GET")
  -url string
    	url to make requests


$  go run hack/benchmark/main.go -url http://127.0.0.1:3000/api -duration 3s -every 20ms

&{OK:150 BadRequest:0 ServerError:0 Redirect:0 Unknown:0 Avg:4.23795ms Min:2.140985ms Max:7.680551ms Total:150
```
