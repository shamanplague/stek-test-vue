const isPlainObject = (value: any) => typeof value === 'object' && !Array.isArray(value)

export const isKeyOf = <T extends object>(obj: T, key: PropertyKey): key is keyof T => {
  return typeof key === 'string' && key in obj
}

export const deepMerge = <T>(target: T, source: Partial<T>): T  => {
  const result = { ...target }

  Object.keys(source).forEach(key => {

    if (!isKeyOf(source, key)) return

    const targetValue = target[key]
    const sourceValue = source[key]

    if (sourceValue && isPlainObject(sourceValue) && isPlainObject(targetValue)) {
      result[key] = deepMerge(targetValue, sourceValue)
    } else if (sourceValue !== undefined) {
      result[key] = sourceValue
    }
  })

  return result
}

export function typedEntries<T extends Record<string, any>>(
  obj: T
): [keyof T, T[keyof T]][] {
  return Object.entries(obj) as [keyof T, T[keyof T]][];
}

export const toFlatObject = <T extends Record<string, any>>(
  obj: T,
  parentKey = '',
  result: Record<string, any> = {}
): Record<string, any> => {
  for (const [key, value] of Object.entries(obj)) {
    const newKey = parentKey ? `${parentKey}.${key}` : key

    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      toFlatObject(value, newKey, result)
    } else {
      result[newKey] = value
    }
  }

  return result
}
