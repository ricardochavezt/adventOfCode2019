# adapted from https://topaz.github.io/paste/#XQAAAQD9AQAAAAAAAAAFCYv/dcJTd8kzW33d5k8b/V8TyIe8jtqHLuWhRScQtarmPaMI9KavTBGf0dlg0GxXvxCqXGiz0k96c4FRzayJj2pK1a8yc90XEffTwNEyCtXk0Dx+4uQh/AeBbo+tbVJfVngKqU4MN4u9YvZUvNps7SHLQObw18znyHQLoTiZixGcGJn5tIFj6PINF1ttjEN7tFGSK5STF+O5WouppYM42yQFeP7036KMZiPqXa3JdCE3WemSbDjpgGRpSLy1YdJG3vx1hVASWejC/TJxQf4ysEvVwJimKNiducO/FW7lTtfvI6bEHs89RJbfhkbn6U1KruFBqYsOZvkOL3AjqjTQCORTQ3q6fzs3YRlYXKj+tTSu
# (because I couldn't come up with a solution on my own T_T)

def valid_number(n)
  repeated_digits = false
  valid_increase = true
  strNumber = n.to_s
  prev = strNumber[0].to_i
  1.upto(strNumber.length-1) do |i|
    curr = strNumber[i].to_i
    valid_increase = false if curr < prev
    # Part 1
    # repeated_digits = true if curr == prev
    # Part 2
    repeated_digits = true if curr == prev && curr != strNumber[i-2].to_i && curr != strNumber[i+1].to_i
    prev = curr
  end
  return repeated_digits && valid_increase
end

lower = 382345
upper = 843167

valid_numbers = []

(lower..upper).each do |n|
  valid_numbers << n if valid_number(n)
end

# valid_numbers.take(100).each { |n| puts n }
puts valid_numbers.length
