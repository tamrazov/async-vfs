import { __getSelectedDir, __isValidPath, __selectDir } from "./helpers.ts"
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
  let pathStack = [""]
  if (filePath === "..") {
    pathStack = ["root"]
  } else {
    pathStack = filePath.split("/") //  'root/etc/docs  /dirName
  }

  // TODO: Write proper .. functionality

  if (__isValidPath(pathStack, tree)) {

    __selectDir(pathStack, tree)

  }
}

export function mkdir(tree: Tree, dirName: string) {
    
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
  if (!selectedNode) return

  selectedNode.directoryContents = { ...selectedNode.directoryContents, ...tempDir}
  console.log("updated tree:", tree)
  console.log("updated tree[qwe]:", tree["root"]?.directoryContents)

}



export function mkfile(fileName: string, tree: Tree,) {
    
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
  if (!selectedNode) return

  selectedNode.directoryContents = { ...selectedNode.directoryContents, ...tempFile}


}
