package main

import (
	"bufio"
	"fmt"
	"math"
	"os"
)

type Point struct {
	X, Y int
}

func main() {
	scanner := bufio.NewScanner(os.Stdin)
	var asteroids []Point
	for row := 0; scanner.Scan(); row++ {
		line := []rune(scanner.Text())
		for col, char := range line {
			if char == '#' {
				asteroids = append(asteroids, Point{row, col})
			}
		}
	}
	maxAsteroidsDetected := 0
	var baseLocation Point
	for i, asteroid := range asteroids {
		relativeAngles := make(map[float64]int)
		for j, otherAsteroid := range asteroids {
			if i == j {
				continue
			}
			x := otherAsteroid.X - asteroid.X
			y := otherAsteroid.Y - asteroid.Y
			slope := math.Atan2(float64(y), float64(x))
			if v, ok := relativeAngles[slope]; ok {
				relativeAngles[slope] = v + 1
			} else {
				relativeAngles[slope] = 1
			}
		}
		if len(relativeAngles) > maxAsteroidsDetected {
			maxAsteroidsDetected = len(relativeAngles)
			baseLocation = asteroid
		}
	}
	fmt.Println("Part 1: max asteroids detected:", maxAsteroidsDetected, "on asteroid", baseLocation)
}
