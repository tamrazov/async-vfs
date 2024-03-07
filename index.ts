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

type Tree = Record<NodeName, TreeNode> 

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

function mkroot(): Tree {
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
// we need to pass every time select node of the tree to find, whether there is a new child node
// if no child node is found we should create a error message
function __isValidPath(path: NodeName[], dir: Tree, index: number = 0): boolean {
    let pathIsValid = false

    let currentPath = path[index] // in 1st round root
    if (!currentPath) return pathIsValid

    const tempDir = dir[currentPath]
    if (tempDir) { // there is definitely root in 1st round
        pathIsValid = true

        const newDir = tempDir.directoryContents
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
    for(const path of pathStack) {
        const treeNode = currentNode[path]
        if (treeNode && __isDir(treeNode.entity)) {
            treeNode.entity.isInside = true
            currentNode = { ...treeNode.directoryContents}
            latestPath = path
        }
    }
    const tempNode = currentNode[latestPath]

    if (!tempNode) return

    const selectedNode = tempNode.entity
    if (__isDir(selectedNode)) {
        selectedNode.isInside = true
    }

}

function __getSelectedDir(tree: Tree): TreeNode | null {
    let selectedNode = tree
    console.log(tree)

    const entries = Object.entries(tree)

    for (const [key, value] of entries) {

        let currentNode = tree[key]
        // console.log(currentNode)
        if (!currentNode) return null

        const directory = currentNode.entity
        console.log('directory', directory)
        if (__isDir(directory) && directory.isInside) {
            console.log('we got selected tree node', tree[key])
            return tree[key] || null
        } else if (currentNode && __isDir(directory)){
            return __getSelectedDir(currentNode.directoryContents!)
        } else {
            console.log('dir couldn\'t be selected')
            return null
        }
    }
    console.log('we failed in some way')
    return null
}

function mkdir(tree: Tree, dirName: string) {
    
    console.log('mk dir is called')
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
    console.log('selected node in mkDir', selectedNode)
    if (!selectedNode) return

    selectedNode.directoryContents = { ...selectedNode.directoryContents, ...tempDir}

    console.log('tree after writing new dir', root['root']?.directoryContents, tree)
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
    console.log('selected node in mkFile', selectedNode)
    if (!selectedNode) return

    selectedNode.directoryContents = { ...selectedNode.directoryContents, ...tempFile}
    console.log('tree after writing new file', root['root']?.directoryContents, tree)


}


// mkdir('docs', root, 'root/estc')


/*
    1. create root
    2. ls -> all contents (root.print)
    3. cd -> dir 
*/


// }
// if (currentPath === filePath.last()) {
//     tree[currentPath].directory?.isInside = true
// } else {
//     currentPath + stack[1] // root/etc вместо расширения заменять на текущее
//     return cd(tree[currentPath], filePath.split('/').pop().toString(),) //  'etc/docs  /dirName
// }
// tree['key']