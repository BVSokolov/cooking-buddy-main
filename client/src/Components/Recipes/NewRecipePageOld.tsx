import React, {useEffect, useState} from 'react'
import styled from 'styled-components'
import {Button} from '../UI/Button'
import {Card} from '../UI/Card'
import {Input} from '../UI/Input'
import {Page} from '../UI/Page'

const SectionTitle = styled.h4`
  margin: 5px;
`

const RecipeTitle = styled(Input)`
  flex: 1 1;
`

const SectionRow = styled.div`
  display: flex;
  flex: 1 1;
  width: 100%;
`

type Ingredient = {
  id: number
  name: string
  amount: string
}
type Section = {
  id: number
  name: string
  entries: Ingredient['id'][]
}
const Ingredients = () => {
  const newIngredient = (): Ingredient => ({
    id: new Date().getTime(),
    name: '',
    amount: '',
  })
  const [ingredients, setIngredients] = useState([newIngredient()])
  const [sections, setSections] = useState<Section[]>([])
  const updatedIngredients = [...ingredients]
  // const onKeyUp = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
  //   //@ts-ignore
  //   const value = e.target.value;

  //   // const ingr = [...ingredients];
  //   // ingr[index] = { name: value, value: "" };
  //   // setIngredients([...ingr]);

  //   // if (value && index === ingredients.length - 1)
  //   //   setIngredients([...ingredients, { name: "", value: "" }]);

  //   // //TODO: Find a better way to code this, kinda crude and ugly
  //   // if (!value && index > 0 && index < ingredients.length - 1)
  //   //   setIngredients([
  //   //     ...ingredients.slice(0, index),
  //   //     ...ingredients.slice(index + 1, ingredients.length),
  //   //   ]);
  // };

  const onChange = (e: React.FormEvent<HTMLDivElement>, index: number) => {
    //@ts-ignore
    const {name, value} = e.target
    if (!['name', 'amount'].includes(name)) return //TODO low put into const array

    const ingredient = updatedIngredients[index]
    //@ts-ignore
    ingredient[name] = value
    updatedIngredients[index] = ingredient

    if (index === updatedIngredients.length - 1) updatedIngredients.push(newIngredient())
    else {
      if (!ingredient.name && !ingredient.amount) updatedIngredients.splice(index, 1)
    }
    setIngredients(updatedIngredients)
  }

  const onClickAddNewSection = (e: React.MouseEvent<HTMLElement>, index: number) => {}

  const onClickRemove = (e: React.MouseEvent<HTMLElement>, index: number) => {
    if (index === updatedIngredients.length - 1) updatedIngredients.push(newIngredient())
    updatedIngredients.splice(index, 1)
    setIngredients(updatedIngredients)
  }

  return (
    <Card style={{flex: '1 1'}}>
      <div style={{width: '100%'}}>
        <SectionRow>
          <SectionTitle>Ingredients</SectionTitle>
        </SectionRow>
        {ingredients.map(({id}, index) => (
          <SectionRow key={id} onChange={(e) => onChange(e, index)}>
            <Button
              onClick={(e) =>
                console.log(
                  'asd should create a new borderless card with the ingredient at index inside it',
                  index,
                )
              }
            >
              {'>'}
            </Button>
            <Input
              name="name"
              placeholder="Ingredient"
              // onKeyUp={(e) => onKeyUp(e, index)}
            />
            <Input name="amount" placeholder="Amount" />
            <Button onClick={(e) => onClickRemove(e, index)}>Remove</Button>
          </SectionRow>
        ))}
      </div>
    </Card>
  )
}

const Steps = () => {
  const newStep = () => ({
    id: new Date().getTime(),
    text: '',
  })
  const [steps, setSteps] = useState([newStep()])
  const updatedSteps = [...steps]

  const onChange = (e: React.FormEvent<HTMLDivElement>, index: number) => {
    //@ts-ignore
    const {value} = e.target
    updatedSteps[index].text = value

    if (index === updatedSteps.length - 1) updatedSteps.push(newStep())
    else {
      if (!value) updatedSteps.splice(index, 1)
    }
    setSteps(updatedSteps)
  }

  return (
    <Card style={{flex: '1 1'}}>
      <div style={{width: '100%'}}>
        <SectionRow>
          <SectionTitle>Steps</SectionTitle>
        </SectionRow>
        {steps.map(({id}, index) => (
          <SectionRow key={id} onChange={(e) => onChange(e, index)}>
            <Input placeholder="Step" />
          </SectionRow>
        ))}
      </div>
    </Card>
  )
}

export const NewRecipePage = () => {
  const [title, setTitle] = useState('')
  const onKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    //TODO Medium validate input
    //@ts-ignore
    setTitle(e.target.value)
  }

  const onSave = () => {}

  return (
    <Page>
      <div style={{display: 'flex'}}>
        <RecipeTitle placeholder="Title" onKeyUp={onKeyUp} />
        <Button onClick={() => console.log('asd click')}>Save</Button>
      </div>
      <div style={{display: 'flex', width: '100%'}}>
        <div style={{display: 'flex', flex: '1 1'}}>
          <Input label="Time in advance to prepare" />
          <Input label="Prep time" />
          <Input label="Cook time" />
          <Input label="Total time" />
        </div>
        <div style={{display: 'flex', flex: '0 1'}}>
          <Input label="Serves" />
        </div>
      </div>
      <div style={{display: 'flex'}}>
        <Ingredients />
        <Steps />
        {/* notes for work in advance, preparation, cooking steps, how to store etc */}
      </div>
    </Page>
  )
}
