package main

import (
	"bufio"
	"fmt"
	"math"
	"os"
	"regexp"
	"strconv"
)

type Vector3D struct {
	X, Y, Z int
}

func updateVelocities(velocities, positions []Vector3D) {
	for i, pos := range positions {
		for j, otherPos := range positions {
			if i == j {
				continue
			}
			switch {
			case pos.X < otherPos.X:
				velocities[i].X += 1
			case pos.X > otherPos.X:
				velocities[i].X -= 1
			}
			switch {
			case pos.Y < otherPos.Y:
				velocities[i].Y += 1
			case pos.Y > otherPos.Y:
				velocities[i].Y -= 1
			}
			switch {
			case pos.Z < otherPos.Z:
				velocities[i].Z += 1
			case pos.Z > otherPos.Z:
				velocities[i].Z -= 1
			}
		}
	}
}

func updatePositions(positions, velocities []Vector3D) {
	for i, vel := range velocities {
		positions[i].X += vel.X
		positions[i].Y += vel.Y
		positions[i].Z += vel.Z
	}
}

const STEPS = 1000

func main() {
	scanner := bufio.NewScanner(os.Stdin)
	re := regexp.MustCompile("x=(-?[0-9]+), y=(-?[0-9]+), z=(-?[0-9]+)")
	positions := make([]Vector3D, 0)
	for scanner.Scan() {
		line := scanner.Text()
		match := re.FindStringSubmatch(line)
		x, _ := strconv.Atoi(match[1])
		y, _ := strconv.Atoi(match[2])
		z, _ := strconv.Atoi(match[3])
		positions = append(positions, Vector3D{X: x, Y: y, Z: z})
	}
	velocities := make([]Vector3D, len(positions))
	fmt.Println("positions:", positions, "velocities:", velocities)
	for i := 1; i <= STEPS; i++ {
		updateVelocities(velocities, positions)
		updatePositions(positions, velocities)
	}
	fmt.Println("positions:", positions, "velocities:", velocities)
	totalEnergy := 0.0
	for n := range positions {
		potential := math.Abs(float64(positions[n].X)) + math.Abs(float64(positions[n].Y)) + math.Abs(float64(positions[n].Z))
		kinetic := math.Abs(float64(velocities[n].X)) + math.Abs(float64(velocities[n].Y)) + math.Abs(float64(velocities[n].Z))
		totalEnergy += (potential * kinetic)
	}
	fmt.Println("Total energy after", STEPS, "steps:", totalEnergy)
}
