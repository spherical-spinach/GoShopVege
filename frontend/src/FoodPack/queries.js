import { gql } from '@apollo/client'
import { FOOD_DETAILS } from '../Food/queries'

const FOODPACK_DETAILS = gql`
  fragment FoodPackDetails on FoodPack {
    id
    name
    price
    kcal
    foodsCount
    foods {
      ...FoodDetails
    }
  }
  ${FOOD_DETAILS}
`

export const ALL_FOODPACKS = gql`
  query allFoodPacks ($name: String) {
    allFoodPacks(name: $name) {
      ...FoodPackDetails
    }
  }
  ${FOODPACK_DETAILS}
`

export const ADD_FOODPACK = gql`
  mutation addFoodPack(
    $name: String!
    $foods: [String!]!
  ) {
    addFoodPack(
      name: $name
      foods: $foods
    ) {
      ...FoodPackDetails
    }
  }
  ${FOODPACK_DETAILS}
`

export const DELETE_FOODPACK = gql`
  mutation deleteFoodPack($id: String!) {
    deleteFoodPack(id: $id)
  }
`