package main

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
)

func main() {
	result := 0
	scanner := bufio.NewScanner(os.Stdin)
	for scanner.Scan() {
		line := []rune(scanner.Text())
		layerWidth, _ := strconv.Atoi(os.Args[1])
		layerHeight, _ := strconv.Atoi(os.Args[2])
		layerSize := layerWidth * layerHeight
		minZeroCount := layerSize
		for i := 0; i < len(line); i += layerSize {
			zeroCount := 0
			oneCount := 0
			twoCount := 0
			for _, r := range line[i : i+layerSize] {
				switch r {
				case '0':
					zeroCount++
				case '1':
					oneCount++
				case '2':
					twoCount++
				}
			}
			if zeroCount < minZeroCount {
				result = oneCount * twoCount
				minZeroCount = zeroCount
			}
		}
	}
	fmt.Println("Result:", result)
}
