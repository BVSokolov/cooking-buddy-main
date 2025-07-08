import {FC, InputHTMLAttributes} from 'react'
import {FormProvider, useFieldArray, useForm, useFormContext} from 'react-hook-form'
import {useNewRecipeMutation} from '../../queries/recipeQueries'
import {NewRecipeFormData} from '../../../../types/types'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string
  label?: string
}

interface FormInputProps extends InputProps {
  name: string
  label?: string
}

const Input: FC<InputProps> = ({name, label, ...props}) => {
  return (
    <>
      {label && <label htmlFor={name}>{label}</label>}
      <input key={name} {...props} />
    </>
  )
}

const FormInput: FC<FormInputProps> = ({name, label, ...props}) => {
  const {register} = useFormContext()
  return (
    <>
      {label && <label htmlFor={name}>{label}</label>}
      <input key={name} {...register(name)} {...props} />
    </>
  )
}

const Ingredients = () => {
  const {fields, append} = useFieldArray({
    name: 'ingredients',
  })

  const onClickAddIngredient = () => {
    append({
      name: '',
      amount: '',
    })
  }

  return (
    <>
      <h4>Ingredients</h4>
      <input type="button" value="+" onClick={onClickAddIngredient} />
      {fields.map((field, index) => (
        <div key={field.id}>
          <FormInput name={`ingredients.${index}.name`} label="name" />
          <FormInput name={`ingredients.${index}.amount`} label="amount" />
        </div>
      ))}
    </>
  )
}

const Steps = () => {
  const {fields, append} = useFieldArray({
    name: 'steps',
  })

  const onClickAddStep = () => {
    append('')
  }

  console.log('steps size', fields.length)

  return (
    <>
      <h4>Steps</h4>
      <input type="button" value="+" onClick={onClickAddStep} />
      {fields.map((field, index) => (
        <div key={field.id}>
          <FormInput name={`steps.${index}.value`} />
        </div>
      ))}
    </>
  )
}

export const NewRecipePage = () => {
  // TODO to use elsewhere later
  // const {isLoading, data} = useGetRecipes()
  const mutation = useNewRecipeMutation()
  const methods = useForm<NewRecipeFormData>({
    defaultValues: {
      ingredients: [{name: '', amount: ''}],
      steps: [{value: ''}],
    },
  })
  const {handleSubmit} = methods

  const onSubmit = (formData: {}) => {
    alert(JSON.stringify(formData))
    mutation.mutate(formData)
  }

  return (
    <FormProvider {...methods}>
      <h3>New Recipe</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <FormInput name="name" label="Recipe name" required />
          <input type="submit" value="Save" />
        </div>
        <FormInput name="timeInAdvance" label="Time in advance to prepare" />
        <FormInput name="timePrep" label="Prep time" />
        <FormInput name="timeCook" label="Cook time" />
        <FormInput name="timeTotal" label="Total time" />
        <div>
          <FormInput name="servings" label="Serves" />
        </div>
        <div>
          <Ingredients />
        </div>
        <div>
          <Steps />
        </div>
      </form>
    </FormProvider>
  )
}
