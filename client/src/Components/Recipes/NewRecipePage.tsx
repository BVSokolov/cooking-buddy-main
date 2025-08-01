import {FC, InputHTMLAttributes} from 'react'
import {FormProvider, useFieldArray, useForm, useFormContext} from 'react-hook-form'
import {useNewRecipeMutation} from '../../queries/recipeQueries'
import {
  NewRecipeFormData,
  NewRecipeIngredientFormData,
  NewRecipeSectionFormData,
  NewRecipeStepFormData,
} from '../../../../types/types'

//==> TODO remove these
export enum TimeUOM {
  NONE = 'none',
  MINUTE = 'minute',
  HOUR = 'hour',
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
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

const getDefaultSectionValues = (tempSectionId: number | null): NewRecipeSectionFormData => ({
  name: '',
  tempSectionId,
})

const getDefaultIngredientValues = (
  index: number,
  tempSectionId: number | null,
): NewRecipeIngredientFormData => ({
  name: '',
  amount: 0,
  //@ts-ignore TODO: remove this and fix the shared types
  amountUOM: QuantityUOM.ITEM,
  position: index,
  refId: null,
  tempSectionId,
})

const getDefaultStepValues = (index: number, tempSectionId: number | null): NewRecipeStepFormData => ({
  text: '',
  position: index,
  tempSectionId,
})

const getDefaultValues = (): NewRecipeFormData => ({
  name: '',
  servings: null,
  time: {
    cook: null,
    inAdvance: null,
    prep: null,
    total: null,
    //@ts-ignore TODO: remove this and fix the shared types
    cookUOM: TimeUOM.NONE,
    //@ts-ignore TODO: remove this and fix the shared types
    inAdvanceUOM: TimeUOM.NONE,
    //@ts-ignore TODO: remove this and fix the shared types
    prepUOM: TimeUOM.NONE,
    //@ts-ignore TODO: remove this and fix the shared types
    totalUOM: TimeUOM.NONE,
  },
  sections: [],
  ingredients: [],
  steps: [],
})

const Section = ({
  currentLoopTempSectionId,
  tempSectionId,
}: {
  currentLoopTempSectionId: NewRecipeSectionFormData['tempSectionId']
  tempSectionId: NewRecipeSectionFormData['tempSectionId']
}) => {
  console.log('Section')
  const {fields: sectionFields} = useFieldArray<
    Partial<{sections: NewRecipeFormData['sections']}>,
    'sections',
    'id'
  >({
    name: 'sections',
  })
  console.log('sections', sectionFields)
  console.log(`currentLoopTempSectionId ${currentLoopTempSectionId}, tempSectionId ${tempSectionId}`)
  if (currentLoopTempSectionId === tempSectionId) return null

  console.log('current loop temp id changed')
  const sectionIndex = sectionFields.findIndex(
    (value: NewRecipeSectionFormData) => value.tempSectionId === tempSectionId,
  )
  console.log('sectionIndex ', sectionIndex)
  if (sectionIndex === -1) return null

  return <FormInput name={`sections.${sectionIndex}.name`} type="text" required />
}

const Ingredients = () => {
  const {fields: ingredientFields, append: appendIngredient} = useFieldArray<
    Partial<{ingredients: NewRecipeFormData['ingredients']}>,
    'ingredients',
    'id'
  >({
    name: 'ingredients',
  })
  const {fields: sectionFields, append: appendSection} = useFieldArray<
    Partial<{sections: NewRecipeFormData['sections']}>,
    'sections',
    'id'
  >({
    name: 'sections',
  })

  let currentCreateTempSectionId: NewRecipeSectionFormData['tempSectionId'] =
    sectionFields.at(-1) !== undefined ? sectionFields.at(-1)!.tempSectionId : null
  const onClickAddIngredient = () => {
    appendIngredient(getDefaultIngredientValues(ingredientFields.length, currentCreateTempSectionId))
  }

  const onClickAddSection = () => {
    currentCreateTempSectionId = Date.now()
    appendSection(getDefaultSectionValues(currentCreateTempSectionId))
    onClickAddIngredient()
  }

  let currentLoopTempSectionId: NewRecipeSectionFormData['tempSectionId'] = null
  return (
    <div>
      <h4>Ingredients</h4>
      {ingredientFields.map((ingredientField, index) => {
        console.log('ingredient field ', ingredientField)
        const SectionEl = (
          <Section
            key={`${ingredientField.id}-section`}
            currentLoopTempSectionId={currentLoopTempSectionId}
            tempSectionId={ingredientField.tempSectionId}
          />
        )
        if (SectionEl !== null) currentLoopTempSectionId = ingredientField.tempSectionId
        return (
          <div key={`${ingredientField.id}-row`}>
            {SectionEl}
            <div key={`${ingredientField.id}-ingredient`}>
              <FormInput name={`ingredients.${index}.name`} label="name" type="text" required />
              <FormInput name={`ingredients.${index}.amount`} label="amount" type="number" required />
              <FormSelect name={`ingredients.${index}.amountUOM`} required>
                {Object.entries(QuantityUOM).map(([key, value]) => (
                  <option key={`${ingredientField.id}-ingredient-amountuom-option-${key}`} value={value}>
                    {key}
                  </option>
                ))}
              </FormSelect>
            </div>
          </div>
        )
      })}
      <div>
        <input type="button" value="add ingredient" onClick={onClickAddIngredient} />
        <input type="button" value="add section" onClick={onClickAddSection} />
      </div>
    </div>
  )
}

const Steps = () => {
  const {fields: stepFields, append: appendStep} = useFieldArray<
    Partial<{steps: NewRecipeFormData['steps']}>,
    'steps',
    'id'
  >({
    name: 'steps',
  })
  const {fields: sectionFields, append: appendSection} = useFieldArray<
    Partial<{sections: NewRecipeFormData['sections']}>,
    'sections',
    'id'
  >({
    name: 'sections',
  })

  let currentCreateTempSectionId: NewRecipeSectionFormData['tempSectionId'] =
    sectionFields.at(-1) !== undefined ? sectionFields.at(-1)!.tempSectionId : null
  const onClickAddStep = () => {
    appendStep(getDefaultStepValues(stepFields.length, currentCreateTempSectionId))
  }

  const onClickAddSection = () => {
    currentCreateTempSectionId = Date.now()
    appendSection(getDefaultSectionValues(currentCreateTempSectionId))
    onClickAddStep()
  }

  let currentLoopTempSectionId: NewRecipeSectionFormData['tempSectionId'] = null

  console.log('steps size', stepFields.length)

  return (
    <div>
      <h4>Steps</h4>
      {stepFields.map((stepField, index) => {
        const SectionEl = (
          <Section
            key={`${stepField.id}-section`}
            currentLoopTempSectionId={currentLoopTempSectionId}
            tempSectionId={stepField.tempSectionId}
          />
        )
        if (SectionEl !== null) currentLoopTempSectionId = stepField.tempSectionId

        return (
          <div>
            {SectionEl}
            <div key={stepField.id}>
              <FormInput name={`steps.${index}.text`} label={`${index + 1}.`} />
            </div>
          </div>
        )
      })}
      <div>
        <input type="button" value="add step" onClick={onClickAddStep} />
        <input type="button" value="add section" onClick={onClickAddSection} />
      </div>
    </div>
  )
}

const TimeEntry = ({name, nameUOM, label}: {name: string; nameUOM: string; label: string}) => {
  return (
    <span>
      <FormInput name={`time.${name}`} label={label} type="number" />
      <FormSelect name={`time.${nameUOM}`} required>
        {Object.entries(TimeUOM).map(([key, value]) => (
          <option key={`time-${name}-timeuom-option-${key}`} value={value}>
            {key}
          </option>
        ))}
      </FormSelect>
    </span>
  )
}

const Time = () => {
  return (
    <div>
      <TimeEntry name="inAdvance" nameUOM="inAdvanceUOM" label="Time in advance to prepare" />
      <TimeEntry name="prep" nameUOM="prepUOM" label="Prep time" />
      <TimeEntry name="cook" nameUOM="cookUOM" label="Cook time" />
      <TimeEntry name="total" nameUOM="totalUOM" label="Total time" />
    </div>
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
    // mutation.mutate(formData)
  }

  return (
    <FormProvider {...methods}>
      <h3>New Recipe</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <FormInput name="name" label="Recipe name" type="text" required />
          <FormInput name="servings" label="Serves" type="number" />
          <input type="submit" value="Save" />
        </div>
        <Time />
        <Ingredients />
        <Steps />
      </form>
    </FormProvider>
  )
}
