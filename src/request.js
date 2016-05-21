import { Observable } from 'rx'

export const prompt$ = 
  Observable.fromPromise(
    fetch('/api/prompt').then(res => res.text())
  )

