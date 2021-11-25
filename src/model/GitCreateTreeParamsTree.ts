export interface GitCreateTreeParamsTree {
    content?: string
    mode?: "100644" | "100755" | "040000" | "160000" | "120000"
    path?: string
    sha?: string
    type?: "blob" | "tree" | "commit"
}