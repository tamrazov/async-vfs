import {__getSelectedDir, __isValidPath, __selectDir, validateName} from "./helpers.ts"
import { Tree } from "./types"

export const EXAMPLE: Tree = {
  "root" : {
    entity: {
      dirName: "root",
      isInside: false,
      entityType: "dir"
    },

    directoryContents: {
      "dir1" : {
        entity: {
          dirName: "dir1",
          isInside: false, 
          entityType: "dir"
        },
        directoryContents: null
      },

      "file_1" : {
        entity: {
          fileName : " file_1",
          fileContents: "bla-bla",
          entityType: "file"

        },
        directoryContents: null
      }
    }
  }
}

/**
 * Creates and returns the root directory in the tree.
 * 
 * @returns The tree structure with the root directory
 */
export function mkroot(): Tree {
  return ({
    "root": {
      entity: {
        dirName: "root",
        isInside: true,
        entityType: "dir"
      },
            
      directoryContents: null
    }
  })
}


export function cd(tree: Tree, filePath: string) {
  if (!filePath || filePath.trim() === "") {
    throw new Error("File path cannot be empty")
  }

  const pathStack = filePath.split("/").filter(Boolean)

  const rootDir = tree["root"]

  if (pathStack[0] === "..") {
    if (rootDir && "isInside" in rootDir.entity && rootDir.entity.isInside) {
      throw new Error("Cannot move to parent directory from the root directory")
    } else {
      pathStack.shift()
    }
  }

  // TODO: Write proper .. functionality

  if (__isValidPath(pathStack, tree)) {
    __selectDir(pathStack, tree)
  } else {
    throw new Error("Invalid file path")
  }
}

export function mkdir(tree: Tree, dirName: string) {

  validateName(dirName)
    
  const tempDir: Tree = {
    [dirName] : {
      entity: {
        dirName: dirName,
        isInside: false,
        entityType: "dir"
      },
    
      directoryContents: null
    }
  }

  const selectedNode = __getSelectedDir(tree)
  if (!selectedNode) {
    throw new Error("No directory is selected")
  }
  
  if (selectedNode && selectedNode.directoryContents && selectedNode.directoryContents[dirName]) {
    throw new Error("Directory with this name already exists")
  }

  selectedNode.directoryContents = { ...selectedNode.directoryContents, ...tempDir}
  console.log("updated tree:", tree)
  console.log("updated tree[qwe]:", tree["root"]?.directoryContents)

}



export function mkfile(fileName: string, tree: Tree,) {

  validateName(fileName)
    
  const tempFile: Tree = {
    [fileName] : {
      entity: {
        fileName : fileName,
        fileContents: "bla-bla",
        entityType: "file"

      },
      directoryContents: null
    }
  }

  const selectedNode = __getSelectedDir(tree)

  if (!selectedNode || !selectedNode.directoryContents) {
    throw new Error("No directory is selected")
  }

  if (selectedNode && selectedNode.directoryContents && selectedNode.directoryContents[fileName]) {
    throw new Error("File with this name already exists")
  }

  selectedNode.directoryContents = { ...selectedNode.directoryContents, ...tempFile}


}
