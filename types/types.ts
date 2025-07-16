export enum TimeUOM {
  MINUTE = 'minute',
  HOUR = 'hour',
  DAY = 'day',
  WEEK = 'week',
  MONT = 'month',
  YEAR = 'year',
}

export enum QuantityUOM {
  GR = 'gr',
  KG = 'kg',
  TSP = 'tsp',
  TBSP = 'Tbsp',
  L = 'l',
  ML = 'ml',
  ITEM = 'item',
  CUP = 'cup',
  PINCH = 'pinch',
}

export type TimeMeasureUnit = Record<TimeUOM, string>
export type QuantityMeasureUnit = Record<QuantityUOM, string>

export type Ingredient = {
  id: string
  name: string
}

export type Recipe = {
  id: string
  name: string
  servings: string | null
}

export type RecipeTime = {
  id: string
  recipeId: string
  inAdvance: number
  prep: number
  cook: number
  total: number
  inAdvanceUOM: TimeMeasureUnit
  prepUOM: TimeMeasureUnit
  cookUOM: TimeMeasureUnit
  totalUOM: TimeMeasureUnit
}

export type RecipeSection = {
  id: string
  recipeId: string
  name: string
  position: number // ADD IN DB AS WELL
}

export type RecipeIngredient = {
  id: string
  ingredientId: string
  recipeId: string
  recipeSectionId: string | null
  amount: number
  amountUOM: QuantityMeasureUnit
  position: number // ADD IN DB AS WELL
}

export type RecipeStep = {
  id: string
  recipeId: string
  recipeSectionId: string | null
  position: number // RENAME IN DB AS WELL
  text: string
}

export type NewRecipeFormData = {
  name: string
  servings: string
  time: Omit<RecipeTime, 'id' | 'recipeId'>
  sections: Array<Omit<RecipeSection, 'id' | 'recipeId'>> // add color or whatever later, needs to be stored in db as well
  ingredients: Array<{
    name: string
    amount: number
    amountUOM: QuantityMeasureUnit
    sectionIndex: number | null //the index within section[]
    position: number
    refId: string | null
  }>
  steps: Array<{
    text: string
    position: number
    sectionIndex: number | null
  }>
}

//=> on fronted only:
//counter = 0
// ref = {'ref<counter>'}
// ref = {ref0, ref1}
//<= on fronted only:

// step 1: chop the onion
// text : chop the ref0
// step 2: chop the garlic and throw the garlic and onion in the pan
// text : chop the ref1 and throw the ref1 and ref0 in the pan

// ingredients: [{name: onion, refId: ref0}, {name: garlic, refId: ref1}, {name: tomato, refId: null}]
// steps: [{text: chop the ref0, position: 0, sectionIndex: null},
//        {text: chop the ref1 and throw the ref1 and ref0 in the pan, position: 1, sectionIndex: null}]

// recipe columns will be id, name, servings
// i have to make five tables next - recipeTime, ingredient, recipeIngredient, recipeSection and recipeStep

// recipeTime columns will be id, recipeId, inAdvance, inAdvanceUOM, prep, prepUOM, cook, cookUOM, total, totalUOM
// all time columns will store time in hours; the enum columns is to remember what the user input and so we can do the conversion back

// ingredient columns will be id, name
// recipeSection coulmns will be id, recipeId, name
// recipeIngredient columns will be id, ingredientId, recipeSectionId, recipeId, amount: int, unit of measurement: enum - amount...
// ... will be a dropdown on UI side so it's always a positive number, UOM will be enum
// recipeStep columns will be id, recipeId, recipeSectionId, number (as in step number, first, second etc), text

export type RecipeData = Recipe &
  RecipeTime &
  Array<RecipeSection> &
  Array<RecipeIngredient> &
  Array<RecipeStep>
