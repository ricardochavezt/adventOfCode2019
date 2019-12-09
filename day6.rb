def parseOrbits(text)
  orbitMap = {}
  santaObject = nil
  myObject = nil
  text.each_line do |line|
    orbiting_around, object_in_orbit = line.chomp.split(")")
    if orbitMap[orbiting_around]
      orbitMap[orbiting_around] << object_in_orbit
    else
      orbitMap[orbiting_around] = [object_in_orbit]
    end
    if object_in_orbit == "SAN"
      santaObject = orbiting_around
    end
    if object_in_orbit == "YOU"
      myObject = orbiting_around
    end
  end
  [orbitMap, santaObject, myObject]
end

def countOrbitsPerLevel(object, orbit_map, curr_level, level_map)
  if level_map[curr_level]
    level_map[curr_level] += 1
  else
    level_map[curr_level] = 1
  end
  if orbit_map[object]
    orbit_map[object].each do |obj|
      countOrbitsPerLevel(obj, orbit_map, curr_level+1, level_map)
    end
  end
end

def tracePathToCOM(object, orbit_map)
  parent = orbit_map.each_key.find { |k| k if orbit_map[k].include?(object) }
  if parent
    path = tracePathToCOM(parent, orbit_map)
    return path << object
  else
    return []
  end
end

map, santaObj, myObj = parseOrbits(ARGF.read)

# Part 1
lvl_map = {}
countOrbitsPerLevel("COM", map, 0, lvl_map)
totalCount = 0
lvl_map.each do |level, count|
  totalCount += (level * count)
end

puts "Part 1: #{totalCount}"

# Part 2
santaPath = tracePathToCOM(santaObj, map)
myPath = tracePathToCOM(myObj, map)

first_different_index = 0
santaPath.zip(myPath).each_with_index do |objs, i|
  if objs[0] != objs[1]
    first_different_index = i
    break
  end
end

# puts first_different_index
# puts santaPath[first_different_index..santaPath.length]
# puts myPath[first_different_index..myPath.length]

puts "Part 2: #{santaPath[first_different_index..santaPath.length].length + myPath[first_different_index..myPath.length].length}"
