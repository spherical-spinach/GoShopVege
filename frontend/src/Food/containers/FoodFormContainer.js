import React, { useState, useEffect } from 'react'
import { useQuery } from '@apollo/client'
import { v4 as uuid } from 'uuid'
import { connect } from 'react-redux'
import { setAlert } from '../../redux/alertReducer'
import useField from '../../hooks/useField'
import { ALL_INGREDIENTS } from '../../Ingredient/queries'
import FoodForm from '../presentational/FoodForm'

// eslint-disable-next-line no-shadow
const FoodFormContainer = ({ food, updateFood, addFood, setAlert }) => {
  const [name] = useField('text', food ? food.name : null)
  const [step, resetStep] = useField('text')
  const [recipe, setRecipe] = useState([])
  const [foodIngredients, setFoodIngredients] = useState(
    food ? food.ingredients : []
  )
  const [price, setPrice] = useState(food ? food.price : 0)
  const [kcal, setKcal] = useState(food ? food.kcal : 0)

  const ingredientsResult = useQuery(ALL_INGREDIENTS)

  useEffect(() => {
    if (food) {
      const recipeRows = food.recipe.map(r => ({ value: r, id: uuid() }))
      setRecipe(recipeRows)
    }
  }, [food])

  if (ingredientsResult.loading) {
    return <div>...loading</div>
  }

  const ingredients = ingredientsResult.data.allIngredients.filter(
    i => !foodIngredients.map(fi => fi.item.id).includes(i.id)
  )

  const parseIngredients = () => {
    return foodIngredients.map(i => `${i.item.id};${i.usedAtOnce ? 1 : 0}`)
  }

  const parseRecipe = () => {
    return recipe.map(row => row.value)
  }

  const toggleUsedAtOnce = event => {
    setFoodIngredients(
      foodIngredients.map(fi =>
        fi.id === event.target.id ? { ...fi, usedAtOnce: !fi.usedAtOnce } : fi
      )
    )
  }

  const handleSelect = ingredientID => {
    const newFoodIngredient = {
      usedAtOnce: true,
      id: uuid(),
    }
    const ingredient = ingredients.find(i => i.id === ingredientID)
    newFoodIngredient.item = ingredient
    setFoodIngredients(foodIngredients.concat(newFoodIngredient))

    setPrice(price + ingredient.price)
    setKcal(kcal + ingredient.kcal)
  }

  const removeIngredient = event => {
    const ingredient = foodIngredients.find(fi => fi.id === event.target.id)
      .item
    setFoodIngredients(foodIngredients.filter(fi => fi.id !== event.target.id))

    setPrice(price - ingredient.price)
    setKcal(kcal - ingredient.kcal)
  }

  const addStep = () => {
    if (step.value.length < 3) {
      setAlert(
        'danger',
        'Yhden reseptin rivin pituuden täytyy olla vähintään 3!'
      )
      return
    }
    if (recipe.map(r => r.value).includes(step.value)) {
      setAlert('danger', 'Reseptissä ei voi olla samoja rivejä!')
      return
    }
    setRecipe(recipe.concat({ value: step.value, id: uuid() }))
    resetStep()
  }

  const removeStep = event => {
    setRecipe(recipe.filter(row => row.id !== event.target.id))
  }

  const submit = async e => {
    e.preventDefault()

    if (name.value.length < 4) {
      setAlert('danger', 'Nimen pituuden täytyy olla vähintään 4 !')
      return
    }

    const foodForParent = {
      name: name.value,
      ingredients: parseIngredients(),
      recipe: parseRecipe(),
    }

    if (food) {
      updateFood(foodForParent)
    } else {
      addFood(foodForParent)
    }
  }

  return (
    <div>
      <h2>{food ? `Päivitä ${food.name}` : 'Luo uusi ruoka'}</h2>
      <strong>
        <p>Yhteishinta: {price.toFixed(2)} €</p>
      </strong>
      <strong>
        <p>Yhteensä kcal: {kcal}</p>
      </strong>
      <FoodForm
        toggleUsedAtOnce={toggleUsedAtOnce}
        foodIngredients={foodIngredients}
        ingredients={ingredients}
        recipe={recipe}
        handleSelect={handleSelect}
        removeIngredient={removeIngredient}
        addStep={addStep}
        removeStep={removeStep}
        submit={submit}
        step={step}
        food={food}
        name={name}
      />
    </div>
  )
}

export default connect(null, { setAlert })(FoodFormContainer)
