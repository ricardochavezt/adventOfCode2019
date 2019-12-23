Ingredient = Struct.new(:name, :quantity) do
  def inspect
    "#{self.quantity} #{self.name}"
  end
end

class Recipe
  attr_accessor :product, :ingredients

  def initialize(product, ingredients = [])
    @product = product
    @ingredients = ingredients
  end

  def inspect
    "#{product.quantity} #{product.name}: #{ingredients.inspect}"
  end
end

def parseRecipes(text)
  ingredient_regex = /(\d+)\s+([A-Z]+)/
  recipes = {}
  text.each_line do |line|
    recipe_string, result_string = line.chomp.split("=>")
    result_match = ingredient_regex.match(result_string.chomp)
    result = Ingredient.new(result_match[2], result_match[1].to_i)
    ingredients = recipe_string.chomp.split(",").collect do |ingredient_string|
      ingredient_match = ingredient_regex.match(ingredient_string)
      Ingredient.new(ingredient_match[2], ingredient_match[1].to_i)
    end
    recipes[result.name] = Recipe.new(result, ingredients)
  end
  recipes
end

def calculateOreNeeded(result, quantity, recipes, waste)
  needed_recipe = recipes[result]
  existing_quantity = waste[result]
  required_quantity = [quantity - existing_quantity, 0].max
  # puts "Need #{quantity} #{result}, already have #{existing_quantity}, require only #{required_quantity}"
  # integer division >:(
  mult = (required_quantity / needed_recipe.product.quantity)
  if required_quantity % needed_recipe.product.quantity > 0
    mult += 1
  end
  extra = needed_recipe.product.quantity*mult - (quantity - existing_quantity)
  # puts "Will produce #{needed_recipe.product.quantity} x #{mult} #{needed_recipe.product.quantity*mult}, with #{extra} exceeding"
  waste[result] = extra if result != "ORE"
  ore = 0
  needed_recipe.ingredients.each do |ingredient|
    if ingredient.name == "ORE"
      ore += ingredient.quantity * mult
    else
      ore += calculateOreNeeded(ingredient.name, mult*ingredient.quantity, recipes, waste)
    end
  end
  return ore
end

if __FILE__ == $0
  recipes = parseRecipes(ARGF.read)
  # puts recipes
  waste = Hash.new(0)
  puts calculateOreNeeded("FUEL", 1, recipes, waste)
  # puts waste
end
