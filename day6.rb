def parseOrbits(text)
  orbitMap = {}
  text.each_line do |line|
    orbiting_around, object_in_orbit = line.chomp.split(")")
    if orbitMap[orbiting_around]
      orbitMap[orbiting_around] << object_in_orbit
    else
      orbitMap[orbiting_around] = [object_in_orbit]
    end
  end
  orbitMap
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

map = parseOrbits(ARGF.read)
lvl_map = {}
countOrbitsPerLevel("COM", map, 0, lvl_map)
totalCount = 0
lvl_map.each do |level, count|
  totalCount += (level * count)
end

puts totalCount
