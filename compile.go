package main

import (
	"bufio"
	"bytes"
	"fmt"
	"io/ioutil"
	"log"
	"os"
	"os/exec"
	"runtime"
	"strings"
)

func main() {
	/*
		b := readFile("input.txt")
		writeFile(b, "output.txt")
	*/
	// burada input.txt den dosyanın adını alıp onu compile etmek üzere elimde tutuyorum
	file, err := os.Open("programs.txt")
	if err != nil {
		log.Fatalf("failed opening file: %s", err)
	}

	scanner := bufio.NewScanner(file)
	scanner.Split(bufio.ScanLines)
	var txtlines []string

	for scanner.Scan() {
		txtlines = append(txtlines, scanner.Text())
	}
	file.Close()
	fmt.Println(txtlines[1])
	err2 := os.Chdir(txtlines[1]) // bulunduğumuz konuma yani programs.txt deki komuta gidiyor
	if err2 != nil {
		panic(err)
	}

	// programı compile eden kod
	if runtime.GOOS == "windows" {
		cmd := exec.Command("gcc", "-o", txtlines[0], txtlines[0]+".c") // build etme kodu
		fmt.Printf("the system is windows\n")
		compileProgram(cmd)
	} else if runtime.GOOS == "linux" {
		cmd := exec.Command("gcc", txtlines[0]+".c", "-o", txtlines[0]) // build etme kodu
		fmt.Printf("the system is linux\n")
		compileProgram(cmd)
	}

	// programın çıktısını yazdıran kod
	if runtime.GOOS == "windows" {
		cmd := exec.Command(txtlines[0])
		outputProgram := runProgram(cmd)
		b := []byte(string(outputProgram))
		writeFile(b, "output.txt")
		fmt.Println(string(outputProgram))
	} else if runtime.GOOS == "linux" {
		fileName := txtlines[0]
		runFile := "./" + fileName
		cmd := exec.Command(runFile) // burada 2 ayrı değişken tanımlayıp birleştirmek gerekecek linux için
		outputProgram := runProgram(cmd)
		b := []byte(string(outputProgram))
		writeFile(b, "output.txt")
		//fmt.Println(string(outputProgram))
	}

}

func writeFile(b []byte, output string) {

	err := ioutil.WriteFile(output, b, 0644)
	if err != nil {
		panic(err)
	}

	/*
		f, err := os.OpenFile("output.txt", os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
		if err != nil {
			log.Fatal(err)
		}

		_, err = f.Write([]byte(b))
		if err != nil {
			log.Fatal(err)
		}

		f.Close()
	*/
}

func readFile(input string) []byte {
	b, err := ioutil.ReadFile(input)
	if err != nil {
		panic(err)
	}
	if b == nil {
		fmt.Println("b bos")
		return nil
	}
	return b
}

func printCommand(cmd *exec.Cmd) {
	fmt.Printf("==> Executing: %s\n", strings.Join(cmd.Args, " "))
}

func printError(err error) {
	if err != nil {
		os.Stderr.WriteString(fmt.Sprintf("==> Error: %s\n", err.Error()))
	}
}

func printOutput(outs []byte) {
	if len(outs) > 0 {
		fmt.Printf("==> Output: %s\n", string(outs))
	}
}
func compileProgram(cmd *exec.Cmd) {
	// Stdout buffer
	cmdOutput := &bytes.Buffer{}
	// Attach buffer to command
	cmd.Stdout = cmdOutput

	// Execute command
	printCommand(cmd)
	err := cmd.Run() // will wait for command to return
	printError(err)
	// Only output the commands stdout3
	outputProgram := cmdOutput.Bytes()
	printOutput(outputProgram)
}

func runProgram(cmd *exec.Cmd) []byte {
	// Stdout buffer
	cmdOutput := &bytes.Buffer{}
	// Attach buffer to command
	cmd.Stdout = cmdOutput

	// Execute command
	printCommand(cmd)
	err := cmd.Run() // will wait for command to return
	printError(err)
	// Only output the commands stdout3
	outputProgram := cmdOutput.Bytes()
	printOutput(outputProgram)
	return outputProgram // program çıktısını döndürüyorum
}
