package main

import (
	"context"
	"flag"
	"fmt"
	"log"
	"net/http"
	"time"
)

type Benchmark struct {
	http     *http.Client
	duration time.Duration
}

type Report struct {
	OK          int
	BadRequest  int
	ServerError int
	Redirect    int
	Unknown     int
	Avg         time.Duration
	Min         time.Duration
	Max         time.Duration
	Total       int
}
type Option interface {
	setOption(opt *Benchmark)
}

type optionFunc func(b *Benchmark)

func (f optionFunc) setOption(b *Benchmark) {
	f(b)
}

// New creates a new helm presets controller with options
func New(opts ...Option) (*Benchmark, error) {
	b := &Benchmark{}
	for _, f := range opts {
		f.setOption(b)
	}
	if b.http == nil {
		b.http = http.DefaultClient
	}
	if b.duration == 0 {
		return nil, fmt.Errorf("missing duration")
	}

	return b, nil
}

func WithClient(client *http.Client) Option {
	return optionFunc(func(c *Benchmark) {
		c.http = client
	})
}

func WithDuration(d time.Duration) Option {
	return optionFunc(func(c *Benchmark) {
		c.duration = d
	})
}

func main() {
	url := flag.String("url", "", "url to make requests")
	method := flag.String("method", "GET", "method for the request")
	duration := flag.Duration("duration", time.Second, "how long benchmark runs")
	every := flag.Duration("every", time.Second, "interval between each request")
	flag.Parse()

	b, err := New(
		WithDuration(*duration),
	)
	if err != nil {
		log.Fatal(err)
	}

	req, err := http.NewRequest(*method, *url, nil)
	if err != nil {
		log.Fatal(err)
	}
	report, err := b.Run(req, time.NewTicker(*every))
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("%+v", report)
}

func (b *Benchmark) Run(req *http.Request, ticker *time.Ticker) (*Report, error) {
	report := &Report{}

	ctx, cancel := context.WithTimeout(context.Background(), b.duration)
	defer cancel()

	for {
		select {
		case <-ctx.Done():
			report.Avg = report.Avg / time.Duration(report.Total)
			return report, nil
		case <-ticker.C:
			now := time.Now()
			r, err := b.http.Do(req)
			if err != nil {
				return nil, err
			}

			switch took := time.Since(now); {
			case took >= report.Max:
				report.Max = took
				fallthrough
			case took <= report.Min:
				report.Min = took
				fallthrough
			default:
				report.Avg += took // avg to be computed at the end of the function when the context expires.
			}

			switch status := r.StatusCode; {
			case status >= 200 && status < 300:
				report.OK++
			case status >= 300 && status < 400:
				report.Redirect++
			case status >= 400 && status < 500:
				report.BadRequest++
			case status >= 500 && status < 600:
				report.ServerError++
			default:
				report.Unknown++
			}
			report.Total++
		}
	}
}
