export interface FileItem {
    fileName: string,
    fileContents: string
    entityType: EntityType
}

export type EntityType = "file" | "dir"

export interface Dir {
    dirName: string,
    isInside: boolean,
    entityType: EntityType
}

export type NodeName = string

export type TreeNode = {
    entity: Dir | FileItem
    directoryContents: Tree | null
}

export type Tree = Record<NodeName, TreeNode>
