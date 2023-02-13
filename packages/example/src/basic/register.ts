import { sessionRef, container } from './service.js'
import crypto from 'crypto'

container.addScoped(() => crypto.randomUUID(), sessionRef)
