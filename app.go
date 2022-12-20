package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"math/rand"
	"os"
	"os/exec"
	"strings"
	"time"

	"golang.org/x/exp/slices"
)

// App struct
type App struct {
	ctx  context.Context
	cmds map[string]*exec.Cmd
	cams []*CameraData
}

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

type SourceType int64

const (
	TCP SourceType = iota
	RTMP
)

type OutputType int64

const (
	None OutputType = iota
	File
	Stream
	Both
)

const (
	CameraCFG      = "./data/cameras.json"
	VideoOutFolder = "F:/temp/ffmpeg/"
)

// var cams = []*CameraData{
// 	{Id: randomUID(8), SourceType: TCP, Name: "Test", Ip: "camera.local", Port: 8888, DestPort: 2134, SaveToFile: true, FileName: "archive", Running: false},
// 	{Id: randomUID(8), SourceType: TCP, Name: "Test 2", Ip: "camera.local", Port: 8888, DestPort: 2134, SaveToFile: true, FileName: "archive", Running: false},
// 	{Id: randomUID(8), SourceType: TCP, Name: "Test 3", Ip: "camera.local", Port: 8888, DestPort: 2134, SaveToFile: true, FileName: "archive", Running: false},
// 	{Id: randomUID(8), SourceType: RTMP, Name: "Test RTMP", Ip: "camera.local", Port: 8888, DestPort: 2134, SaveToFile: true, FileName: "archive", Running: false},
// }

// NewApp creates a new App application struct
func NewApp() *App {
	os.Mkdir("./data", 0o666)
	content, err := os.ReadFile(CameraCFG)
	cameras := []*CameraData{}
	if err != nil {
		file, err := os.Create(CameraCFG)
		if err != nil {
			fmt.Println(err.Error())
		}
		_, err = file.WriteString("[]")
		if err != nil {
			fmt.Println(err.Error())
		}
		defer file.Close()
	} else {
		err = json.Unmarshal(content, &cameras)
		if err != nil {
			log.Fatal("Error during Unmarshal(): ", err)
		}
	}

	return &App{
		cmds: make(map[string]*exec.Cmd),
		cams: cameras,
	}
}

func SaveCamerasConfig(cams []*CameraData) bool {
	d1, err := json.Marshal(cams)
	if err != nil {
		log.Fatal("Error during Marshal(): ", err)
		return false
	}
	err = os.WriteFile(CameraCFG, d1, 0o644)
	if err != nil {
		log.Fatal("Error during Writing: ", err)
		return false
	}
	return true
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	fmt.Println("Online!")
	a.ctx = ctx
}

func (a *App) beforeClose(ctx context.Context) bool {
	fmt.Println("Stopping ffmpeg streams!")
	for _, cmd := range a.cmds {
		fmt.Println("Killing a command...")
		if err := cmd.Process.Kill(); err != nil {
			log.Fatal("failed to kill process: ", err)
		}
	}
	return false
}

func (a *App) GetCameras() []*CameraData {
	return a.cams
}

func (a *App) GetCamera(id string) *CameraData {
	idx := slices.IndexFunc(a.cams, func(c *CameraData) bool { return c.Id == id })
	return a.cams[idx]
}

func (a *App) SaveCamera(data CameraData) CameraData {
	idx := slices.IndexFunc(a.cams, func(c *CameraData) bool { return c.Id == data.Id })
	if idx == -1 {
		a.cams = append(a.cams, &data)
	} else {
		a.cams = append(append(a.cams[0:idx], &data), a.cams[idx+1:]...)
	}

	SaveCamerasConfig(a.cams)
	return data
}

func (a *App) StopCamera(id string) bool {
	idx := slices.IndexFunc(a.cams, func(c *CameraData) bool { return c.Id == id })
	if !a.cams[idx].Running {
		return false
	}
	if err := a.cmds[id].Process.Kill(); err != nil {
		log.Fatal("failed to kill process: ", err)
		return false
	}
	a.cams[idx].Running = false
	return true
}

func (a *App) StartCamera(id string) bool {
	idx := slices.IndexFunc(a.cams, func(c *CameraData) bool { return c.Id == id })
	if a.cams[idx].Running {
		return false
	}

	cmdRet := make(chan *exec.Cmd, 1)
	go Run(cmdRet, a.cams[idx])
	cmd := <-cmdRet
	a.cmds[id] = cmd
	return true
}

func Run(cmdRet chan *exec.Cmd, data *CameraData) {
	fmt.Println("Starting ffmpeg...")
	data.Running = true
	var ffmpegCmd strings.Builder
	ffmpegCmd.WriteString("ffmpeg -re -fflags nobuffer -flags low_delay -strict experimental ")
	switch data.SourceType {
	case TCP:
		ffmpegCmd.WriteString(fmt.Sprintf(`-i tcp://%s:%d `, data.Ip, data.Port))
	case RTMP:
		ffmpegCmd.WriteString(fmt.Sprintf(`-f flv -listen 1 -i rtmp://%s:%d/live/%s `, data.Ip, data.Port, data.Id))
	}

	ffmpegCmd.WriteString("-c:v copy ")
	now := time.Now() // current local time
	sec := now.Unix() // number of seconds since January 1, 1970 UTC
	switch data.OutputType {
	case Both:
		ffmpegCmd.WriteString(fmt.Sprintf(`-f tee -map 0:v %s%s-%d.mkv|[f=mpegts]udp://127.0.0.1:%d/`, VideoOutFolder, data.FileName, sec, data.DestPort))
	case File:
		ffmpegCmd.WriteString(fmt.Sprintf(`-map 0:v %s%s-%d.mkv`, VideoOutFolder, data.FileName, sec))
	case Stream:
		ffmpegCmd.WriteString(fmt.Sprintf(`-f mpegts -map 0:v udp://127.0.0.1:%d`, data.DestPort))
	}

	cmdStr := ffmpegCmd.String()
	fmt.Println("ffmpeg Command: " + cmdStr)

	args := strings.Fields(cmdStr)
	cmd := exec.Command(args[0], args[1:]...)
	cmdRet <- cmd
	stdout, err := cmd.StdoutPipe()
	cmd.Stderr = cmd.Stdout
	if err != nil {
		fmt.Print(err.Error())
		return
	}
	if err = cmd.Start(); err != nil {
		fmt.Print(err.Error())
		return
	}
	fmt.Println("Running! Getting output...")
	for {
		tmp := make([]byte, 1024)
		_, err := stdout.Read(tmp)
		// fmt.Print(string(tmp))
		if err != nil {
			break
		}
	}
	fmt.Println("ffmpeg closing...")
	data.Running = false
}

var LETTERS = []rune("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ")

func randomUID(length int) string {
	b := make([]rune, length)
	for i := range b {
		b[i] = LETTERS[rand.Intn(len(LETTERS))]
	}
	return string(b)
}
