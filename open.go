package main

import "os"

func main() {
	os.Mkdir("ahmet", os.ModePerm)
	os.Chdir("ahmet")
	os.Create("output.txt")
}
