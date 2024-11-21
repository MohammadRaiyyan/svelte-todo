export  type Task = {
    id:string,
    content: string,
    done: boolean,
}
export type Filter = "all" | "done" | "todo"