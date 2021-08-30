package main_test

import (
	"fmt"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	bench "bench"
)

func Test_Benchmark(t *testing.T) {
	var calls int
	svr := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		calls++
	}))
	defer svr.Close()

	b, err := bench.New(
		bench.WithDuration(5 * time.Second),
	)
	if err != nil {
		t.Fatal(err)
	}
	req, _ := http.NewRequest("GET", svr.URL, nil)

	t.Run("running 1 rps for 5s", func(t *testing.T) {
		got, err := b.Run(req, time.NewTicker(time.Second))
		if err != nil {
			t.Fatal(err)
		}

		wantTotal := 5
		if got.Total != wantTotal {
			t.Fatalf("Total = %d want %d", got.Total, wantTotal)
		}

		fmt.Printf("%+v", got)
	})
}
