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

// greatest common divisor
func gcd(a, b int64) int64 {
	for b > 0 {
		temp := b
		b = a % b
		a = temp
	}
	return a
}

// least common multiple
func lcm(a, b int64) int64 {
	return a * (b / gcd(a, b))
}

// least common multiple of 3 numbers
func lcm3(a, b, c int64) int64 {
	result := lcm(a, b)
	return lcm(result, c)
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
	fmt.Println("initial state: positions:", positions, ", velocities:", velocities)
	initialPositions := make([]Vector3D, len(positions))
	copy(initialPositions, positions)
	initialVelocities := make([]Vector3D, len(velocities))
	copy(initialVelocities, velocities)
	var cycleX, cycleY, cycleZ int64
	for i := 1; true; i++ {
		updateVelocities(velocities, positions)
		updatePositions(positions, velocities)
		if i == STEPS {
			fmt.Println("positions:", positions, "velocities:", velocities)
			totalEnergy := 0.0
			for n := range positions {
				potential := math.Abs(float64(positions[n].X)) + math.Abs(float64(positions[n].Y)) + math.Abs(float64(positions[n].Z))
				kinetic := math.Abs(float64(velocities[n].X)) + math.Abs(float64(velocities[n].Y)) + math.Abs(float64(velocities[n].Z))
				totalEnergy += (potential * kinetic)
			}
			fmt.Println("Total energy after", STEPS, "steps:", totalEnergy)
		}
		var equalStatesX, equalStatesY, equalStatesZ = true, true, true
		for i2 := range positions {
			if positions[i2].X != initialPositions[i2].X || velocities[i2].X != initialVelocities[i2].X {
				equalStatesX = false
			}
			if positions[i2].Y != initialPositions[i2].Y || velocities[i2].Y != initialVelocities[i2].Y {
				equalStatesY = false
			}
			if positions[i2].Z != initialPositions[i2].Z || velocities[i2].Z != initialVelocities[i2].Z {
				equalStatesZ = false
			}
		}
		if equalStatesX {
			cycleX = int64(i)
		}
		if equalStatesY {
			cycleY = int64(i)
		}
		if equalStatesZ {
			cycleZ = int64(i)
		}
		if cycleX != 0 && cycleY != 0 && cycleZ != 0 {
			fmt.Println("States repeat after N cycles: ", cycleX, "(X)", cycleY, "(Y)", cycleZ, "(Z)")
			fmt.Println("Whole system should repeat after", lcm3(cycleX, cycleY, cycleZ), "cycles")
			break
		}
		if i == 1000000000 {
			fmt.Println("cycles not found after too many iterations")
			break
		}
	}
}
