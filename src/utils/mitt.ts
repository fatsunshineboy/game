export default () => {
    const n = new Map()
    return {
      clear() {
        n && n.clear()
      },
      on(event:string, callback:Function) {
        const i = n.get(event)
        i ? i.push(callback) : n.set(event, [callback])
      },
      off(event:string) {
        const i = n.get(event)
        i && n.set(event, [])
      },
      emit(event:string, value:any) {
        const i = n.get(event)
        i && i.slice().map((func: (arg0: any) => any) => func(value))
      }
    }
  }