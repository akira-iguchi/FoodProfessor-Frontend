export type Procedure = {
  id: number
  procedureContent: string
  procedureImage?: {
    url: string
  }
  order: number
  recipeId: number
}
