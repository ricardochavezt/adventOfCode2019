package main

import (
	"bufio"
	"fmt"
	"math"
	"os"
	"sort"
)

type Point struct {
	X, Y int
}

func distance(p1, p2 Point) float64 {
	dx := p2.X - p1.X
	dy := p2.Y - p1.Y
	return math.Sqrt(float64(dx*dx + dy*dy))
}

func main() {
	scanner := bufio.NewScanner(os.Stdin)
	var asteroids []Point
	for row := 0; scanner.Scan(); row++ {
		line := []rune(scanner.Text())
		for col, char := range line {
			if char == '#' {
				asteroids = append(asteroids, Point{col, row})
			}
		}
	}
	maxAsteroidsDetected := 0
	var baseLocation Point
	var asteroidsByAngle map[float64][]Point
	for i, asteroid := range asteroids {
		relativeAngles := make(map[float64][]Point)
		for j, otherAsteroid := range asteroids {
			if i == j {
				continue
			}
			x := otherAsteroid.X - asteroid.X
			y := otherAsteroid.Y - asteroid.Y
			slope := math.Atan2(float64(x), float64(y))
			if v, ok := relativeAngles[slope]; ok {
				relativeAngles[slope] = append(v, otherAsteroid)
			} else {
				relativeAngles[slope] = []Point{otherAsteroid}
			}
		}
		if len(relativeAngles) > maxAsteroidsDetected {
			maxAsteroidsDetected = len(relativeAngles)
			baseLocation = asteroid
			asteroidsByAngle = relativeAngles
		}
	}
	fmt.Println("Part 1: max asteroids detected:", maxAsteroidsDetected, "on asteroid", baseLocation)

	// Part 2
	const N = 200
	angles := make([]float64, 0, len(asteroidsByAngle))
	for angle, asteroidList := range asteroidsByAngle {
		angles = append(angles, angle)
		sort.Slice(asteroidList, func(i, j int) bool {
			return distance(baseLocation, asteroidList[i]) < distance(baseLocation, asteroidList[j])
		})
	}
	sort.Slice(angles, func(i, j int) bool { return (math.Pi/2 - angles[i]) < (math.Pi/2 - angles[j]) })
	// fast solution
	numLoops := (N - 1) / len(angles)
	remainder := (N - 1) % len(angles)
	foundAngle := angles[remainder]
	nthAsteroid := asteroidsByAngle[foundAngle][numLoops]
	fmt.Println(N, "th asteroid: X:", nthAsteroid.X, "Y:", nthAsteroid.Y)
}
