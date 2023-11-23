export interface Notification {
  notification: string
}

export interface ServerToClientEvents {
  newNotification: (payload: Notification) => void
}
