import {FC, InputHTMLAttributes} from 'react'
import {FormProvider, useFieldArray, useForm, useFormContext} from 'react-hook-form'
import {useNewRecipeMutation} from '../../queries/recipeQueries'
import {NewRecipeFormData} from '../../../../types/types'

//==> TODO remove these
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
// <==

//==> TODO Move these elsewhere
interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string
  label?: string
}

interface FormSelectProps extends InputHTMLAttributes<HTMLSelectElement> {
  name: string
  label?: string
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

const FormSelect: FC<FormSelectProps> = ({name, label, children, ...props}) => {
  const {register} = useFormContext()
  return (
    <>
      {label && <label htmlFor={name}>{label}</label>}
      <select key={name} {...register(name)} {...props}>
        {children}
      </select>
    </>
  )
}
// <==

const getDefaultValues = (): NewRecipeFormData => ({
  name: '',
  servings: null,
  time: {
    cook: null,
    inAdvance: null,
    prep: null,
    total: null,
    cookUOM: null,
    inAdvanceUOM: null,
    prepUOM: null,
    totalUOM: null,
  },
  sections: [],
  ingredients: [],
  steps: [],
})

const Ingredients = () => {
  const {fields, append} = useFieldArray({
    name: 'ingredients',
  })

  const onClickAddIngredient = () => {
    append({
      name: '',
      amount: null,
      amountUOM: QuantityUOM.ITEM,
    })
  }

  return (
    <>
      <h4>Ingredients</h4>
      <input type="button" value="+" onClick={onClickAddIngredient} />
      {fields.map((field, index) => (
        <div key={field.id}>
          <FormInput name={`ingredients.${index}.name`} label="name" type="text" required />
          <FormInput name={`ingredients.${index}.amount`} label="amount" type="number" required />
          <FormSelect name={`ingredients.${index}.amountUOM`} required>
            {Object.keys(QuantityUOM).map((key) => (
              //@ts-ignore TODO fix this can't deal with this shit right now...........
              <option value={QuantityUOM[key]}>{key}</option>
            ))}
          </FormSelect>
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
    append({
      text: '',
      position: fields.length,
      sectionIndex: null,
    })
  }

  console.log('steps size', fields.length)

  return (
    <>
      <h4>Steps</h4>
      <input type="button" value="+" onClick={onClickAddStep} />
      {fields.map((field, index) => (
        <div key={field.id}>
          <FormInput name={`steps.${index}.text`} />
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
    defaultValues: getDefaultValues(),
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
          <FormInput name="name" label="Recipe name" type="text" required />
          <input type="submit" value="Save" />
        </div>
        <div>
          <FormInput name="time.inAdvance" label="Time in advance to prepare" type="number" />
          <FormInput name="time.prep" label="Prep time" type="number" />
          <FormInput name="time.cook" label="Cook time" type="number" />
          <FormInput name="time.total" label="Total time" type="number" />
        </div>
        <div>
          <FormInput name="servings" label="Serves" type="number" />
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
