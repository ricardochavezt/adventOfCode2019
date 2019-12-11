package main

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
	"strings"
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
		image := make([]rune, layerSize)
		for n := range image {
			image[n] = '2'
		}
		for i := 0; i < len(line); i += layerSize {
			zeroCount := 0
			oneCount := 0
			twoCount := 0
			for i2, r := range line[i : i+layerSize] {
				switch r {
				case '0':
					zeroCount++
				case '1':
					oneCount++
				case '2':
					twoCount++
				}
				if image[i2] == '2' {
					image[i2] = r
				}
			}
			if zeroCount < minZeroCount {
				result = oneCount * twoCount
				minZeroCount = zeroCount
			}
		}
		fmt.Println("Result:", result)
		for l := 0; l < len(image); l += layerWidth {
			s := string(image[l : l+layerWidth])
			fmt.Println(strings.Replace(s, "0", " ", -1))
		}
	}
}
