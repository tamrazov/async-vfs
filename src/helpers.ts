import { Dir, FileItem, NodeName, Tree, TreeNode } from "./types.ts"

export function __isFile(entity: Dir | FileItem): entity is FileItem {
  return entity.entityType === "file" ? true : false
}

export function __isDir(entity: Dir | FileItem): entity is Dir {
  return entity.entityType === "dir" ? true : false
}

/**
 * Checks if the given path is valid within the tree.
 * 
 * @param path - The path to validate
 * @param dir - The directory tree to traverse
 * @param index - The current index in the path
 * @returns A boolean indicating whether the path is valid
 */
export function __isValidPath(path: NodeName[], dir: Tree, index: number = 0): boolean {
  let pathIsValid = false
  let currentDir = dir

  for (let i = index; i < path.length; i++) {
    const currentPath = path[i]
    if (!currentPath) return false

    const tempDir = currentDir[currentPath]

    if (!tempDir) {
      return false
    }

    pathIsValid = true
    if (tempDir && tempDir.directoryContents) {
      currentDir = tempDir.directoryContents
    }

    if (!currentDir && i < path.length - 1) {
      return false
    }
  }

  return pathIsValid
}

export function __selectDir(pathStack: NodeName[], tree: Tree) {
    
  let currentNode = tree
  let latestPath = ""
  console.log("Current Node:", currentNode)
  console.log("Latest Path:", latestPath)
  console.log("Target Path:", pathStack)


  for(const path of pathStack) {
    const treeNode = currentNode && currentNode[path]

    console.log("Tree Node:", treeNode)

    if (treeNode && __isDir(treeNode.entity)) {
      console.log("Entity:", treeNode.entity)
      treeNode.entity.isInside = false
      console.log("Entity after setting isInside:", treeNode.entity)
      if (treeNode.directoryContents) currentNode = { ...treeNode.directoryContents}
      console.log("Current Node after updating:", currentNode)
      latestPath = path
      console.log("Latest Path updated:", latestPath)
    }
  }
    
  const tempNode = currentNode && currentNode[latestPath]
  console.log("Temp Node:", tempNode)

  if (!tempNode) {
    throw new Error("Selected node not found")
  }

  const selectedNode = tempNode.entity
  console.log("Selected Node:", selectedNode)

  if (__isDir(selectedNode)) {
    selectedNode.isInside = true
    console.log("selectedNode", selectedNode)
  }
}

export function __getSelectedDir(tree: Tree): TreeNode | null {

  const entries = Object.entries(tree || {}) 

  for (const [key] of entries) {

    const currentNode = tree[key]
    if (!currentNode) {
      throw new Error("Selected node not found")
    }

    const directory = currentNode.entity
    if (__isDir(directory) && directory.isInside) {
      return tree[key] || null
    } else if (currentNode && __isDir(directory)){
      return __getSelectedDir(currentNode.directoryContents!)
    } else {
      return null
    }
  }
  return null
}

export function validateName(name: string): void {
  if (!name || name.trim() === "") {
    throw new Error("Name cannot be empty")
  }
  if (/[^a-zA-Z0-9_\-.]/.test(name)) {
    throw new Error("Name contains invalid characters")
  }
}