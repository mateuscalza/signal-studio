import { useAsync } from 'react-use'

export function useFileContents(file, encoding = 'UTF-8') {
  return useAsync(async () => {
    if (!file) {
      return null
    }

    const reader = new FileReader()
    const promise = new Promise((resolve, reject) => {
      reader.onload = (event) => resolve(event.target.result)
      reader.onerror = () => reject(reader.error)
    })
    reader.readAsText(file, encoding)
    return promise
  }, [file])
}
