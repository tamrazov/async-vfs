interface FileItem {
    fileName: string,
    fileContents: string
    entityType: EntityType
}

type EntityType = 'file' | 'dir'

interface Dir {
    dirName: string,
    isInside: boolean,
    entityType: EntityType
}

type NodeName = string

type TreeNode = {
    entity: Dir | FileItem
    directoryContents: Tree | null
}

export type Tree = Record<NodeName, TreeNode> 

const test: Tree = {
    'root' : {
        entity: {
            dirName: 'root',
            isInside: false,
            entityType: 'dir'
        },

        directoryContents: {
            'dir1' : {
                entity: {
                    dirName: 'dir1',
                    isInside: false, 
                    entityType: 'dir'
                },
                directoryContents: null
            },

            'file_1' : {
                entity: {
                    fileName : ' file_1',
                    fileContents: 'bla-bla',
                    entityType: 'file'

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
        'root': {
            entity: {
                dirName: 'root',
                isInside: true,
                entityType: 'dir'
            },
            
            directoryContents: null
        }
    })
}


function __isFile(entity: Dir | FileItem): entity is FileItem {
    return entity.entityType === 'file' ? true : false
}

function __isDir(entity: Dir | FileItem): entity is Dir {
    return entity.entityType === 'dir' ? true : false
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

    let currentPath = path[index] // in 1st round root
    if (!currentPath) return pathIsValid

    const tempDir = dir[currentPath]
    
    if (tempDir) { // there is definitely root in 1st round
        pathIsValid = true

        const newDir = tempDir?.directoryContents
        
        if (newDir) { // if there is another folder, we call recursive func to dig deeper
            return __isValidPath(path, newDir, index + 1)
        } else if (path[index + 1]) { // there might be no more dir contents, but path suggests that there is, than path is not valid
            pathIsValid = false
        } else { // if there is no more dir contents, we are, where we need to be
            pathIsValid = true
        }
    } else {
        pathIsValid = false
    }
    return pathIsValid
}

function cd(tree: Tree, filePath: string, index = 0,) {
    let pathStack = ['']
    if (filePath === '..') {
        pathStack = ['root']
    } else {
        pathStack = filePath.split('/') //  'root/etc/docs  /dirName
    }

    // TODO: Write proper .. functionality

   if (__isValidPath(pathStack, tree)) {

    // let currentNode = tree
    // for(const path of pathStack) {
    //     currentNode.directory['isInside'] = false
    //     currentNode = { ...currentNode[path].directoryContents}
    // }
    __selectDir(pathStack, tree)

    }
}

const root = mkroot()

cd(root, 'root/')

mkdir(root, 'qwe')
mkfile('The story of great adventures', root)

cd(root, 'root/qwe')
mkdir(root, 'asd')



function __selectDir(pathStack: NodeName[], tree: Tree) {
    
    let currentNode = tree
    let latestPath = ''
    console.log('Current Node:', currentNode)
    console.log('Latest Path:', latestPath)
    console.log('Target Path:', pathStack)


    for(const path of pathStack) {
        const treeNode = currentNode && currentNode[path]

        console.log('Tree Node:', treeNode)

        if (treeNode && __isDir(treeNode.entity)) {
                            console.log('Entity:', treeNode.entity)
            treeNode.entity.isInside = false
                            console.log('Entity after setting isInside:', treeNode.entity)
           if (treeNode.directoryContents) currentNode = { ...treeNode.directoryContents}
                             console.log('Current Node after updating:', currentNode)
            latestPath = path
                            console.log('Latest Path updated:', latestPath)
        }
    }
    
    const tempNode = currentNode && currentNode[latestPath]
    console.log('Temp Node:', tempNode)

    if (!tempNode) {
        console.log('temp node not found')
        return
    }

    const selectedNode = tempNode.entity
    console.log('Selected Node:', selectedNode)

    if (__isDir(selectedNode)) {
        selectedNode.isInside = true
        console.log('selectedNode', selectedNode)
    }
}

function __getSelectedDir(tree: Tree): TreeNode | null {
    let selectedNode = tree

    const entries = Object.entries(tree || {}) 

    for (const [key, value] of entries) {

        let currentNode = tree[key]
        if (!currentNode) return null

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

export function mkdir(tree: Tree, dirName: string) {
    
    const tempDir: Tree = {
        [dirName] : {
            entity: {
                dirName: dirName,
                isInside: false,
                entityType: 'dir'
            },
    
            directoryContents: null
        }
    }

    const selectedNode = __getSelectedDir(tree)
    if (!selectedNode) return

    selectedNode.directoryContents = { ...selectedNode.directoryContents, ...tempDir}
    console.log('updated tree:', tree)
    console.log('updated tree[qwe]:', tree['root']?.directoryContents)

}



function mkfile(fileName: string, tree: Tree,) {
    
    const tempFile: Tree = {
        [fileName] : {
            entity: {
                fileName : fileName,
                fileContents: 'bla-bla',
                entityType: 'file'

            },
            directoryContents: null
        }
    }

    const selectedNode = __getSelectedDir(tree)
    if (!selectedNode) return

    selectedNode.directoryContents = { ...selectedNode.directoryContents, ...tempFile}


}


// }
// if (currentPath === filePath.last()) {
//     tree[currentPath].directory?.isInside = true
// } else {
//     currentPath + stack[1] // root/etc вместо расширения заменять на текущее
//     return cd(tree[currentPath], filePath.split('/').pop().toString(),) //  'etc/docs  /dirName
// }
// tree['key']