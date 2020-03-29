import { gql } from '@apollo/client'
import { INGREDIENT_DETAILS } from '../Ingredient/queries'

export const FOOD_DETAILS = gql`
  fragment FoodDetails on Food {
    id
    name
    price
    kcal
    recipe
    ingredientsCount
    ingredients {
      id
      usedAtOnce
      item {
        ...IngredientDetails
      }
    }
  }
  ${INGREDIENT_DETAILS}
`

export const ALL_FOODS = gql`
  query allFoods ($name: String) {
    allFoods(name: $name) {
      ...FoodDetails
    }
  }
  ${FOOD_DETAILS}
`

export const ADD_FOOD = gql`
  mutation addFood(
    $name: String!
    $price: Float!
    $kcal: Int
  ) {
    addFood(
      name: $name
      price: $price
      kcal: $kcal
    ) {
      ...FoodDetails
    }
  }
  ${FOOD_DETAILS}
`