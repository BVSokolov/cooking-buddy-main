import {FC, InputHTMLAttributes, useState} from 'react'
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
    cookUOM: null,
    inAdvanceUOM: null,
    prepUOM: null,
    totalUOM: null,
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
  console.log('tempSectionId ', tempSectionId)
  const {fields: sectionFields} = useFieldArray<
    Partial<{sections: NewRecipeFormData['sections']}>,
    'sections',
    'id'
  >({
    name: 'sections',
  })
  console.log('sections ', sectionFields)

  const getSectionById = (tempSectionId: NewRecipeSectionFormData['tempSectionId']) => {
    const index = sectionFields.findIndex(
      (value: NewRecipeSectionFormData) => value.tempSectionId === tempSectionId,
    )
    if (index === -1) return null
    return {index, section: sectionFields.at(index)}
  }
  const getSectionInfo = () => {
    console.log('currentLoopTempSectionId and tempSectionId', currentLoopTempSectionId, tempSectionId)
    if (currentLoopTempSectionId === tempSectionId) return null

    currentLoopTempSectionId = tempSectionId
    const section = getSectionById(currentLoopTempSectionId)
    return section
  }
  const sectionInfo = getSectionInfo()
  console.log('sectionInfo ', sectionInfo, sectionInfo?.section?.id)

  return sectionInfo ? (
    <div key={sectionInfo.section!.id}>
      <FormInput name={`sections.${sectionInfo.index}.name`} type="text" required />
    </div>
  ) : (
    <></>
  )
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
    <>
      <h4>Ingredients</h4>
      {ingredientFields.map((ingredientField, index) => {
        console.log('ingredient field ', ingredientField)

        return (
          <div>
            <Section
              currentLoopTempSectionId={currentLoopTempSectionId}
              tempSectionId={ingredientField.tempSectionId}
            />
            <div key={ingredientField.id}>
              <FormInput name={`ingredients.${index}.name`} label="name" type="text" required />
              <FormInput name={`ingredients.${index}.amount`} label="amount" type="number" required />
              <FormSelect name={`ingredients.${index}.amountUOM`} required>
                {Object.keys(QuantityUOM).map((key) => (
                  //@ts-ignore TODO fix this can't deal with this shit right now...........
                  <option value={QuantityUOM[key]}>{key}</option>
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
    </>
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
    <>
      <h4>Steps</h4>
      {stepFields.map((stepField, index) => (
        <div>
          <Section
            currentLoopTempSectionId={currentLoopTempSectionId}
            tempSectionId={stepField.tempSectionId}
          />
          <div key={stepField.id}>
            <FormInput name={`steps.${index}.text`} />
          </div>
        </div>
      ))}
      <div>
        <input type="button" value="add step" onClick={onClickAddStep} />
        <input type="button" value="add section" onClick={onClickAddSection} />
      </div>
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
    // mutation.mutate(formData)
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
