import { TrackingContainer } from 'symboldi/tracking'

// empty container
export const container = new TrackingContainer()

// define ref for session
export const sessionRef = TrackingContainer.ref<string>()
