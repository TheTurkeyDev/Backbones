package main

type CameraData struct {
	Id         string     `json:"id"`
	SourceType SourceType `json:"sourceType"`
	OutputType OutputType `json:"outputType"`
	Name       string     `json:"name"`
	Ip         string     `json:"ip"`
	Port       int        `json:"port"`
	DestPort   int        `json:"destPort"`
	FileName   string     `json:"fileName"`
	Running    bool       `json:"running"`
}
