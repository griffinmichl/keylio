import util from './util'
import config from './config'
import request from './request'
import event from './event'
import store from './store'
import { prompt$ } from './request'

const prompt = document.querySelector('.prompt')
prompt$.subscribe(textPrompt => {
  const textNode = document.createTextNode(textPrompt)
  prompt.innerHTML = ''
  prompt.appendChild(textNode)
})

