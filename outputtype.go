package main

type OutputType int64

const (
	None OutputType = iota
	File
	Stream
	Both
)
