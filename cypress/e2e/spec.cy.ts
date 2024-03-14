import { Tree } from "src/types"
import { mkroot } from "src/index"
import { __isValidPath } from "src/helpers"
import { mkdir } from "src/index"

describe("mkroot Test", () => {
  it("Creates the root directory", () => {
    cy.wrap(mkroot()).should("deep.equal", {
      root: {
        entity: {
          dirName: "root",
          isInside: true,
          entityType: "dir",
        },
        directoryContents: null,
      },
    })
  })
})

describe("__isValidPath", () => {
  const tree: Tree = {
    root: {
      entity: {
        dirName: "root",
        isInside: false,
        entityType: "dir",
      },
      directoryContents: {
        folder1: {
          entity: {
            dirName: "folder1",
            isInside: false,
            entityType: "dir",
          },
          directoryContents: {
            folder2: {
              entity: {
                dirName: "folder2",
                isInside: false,
                entityType: "dir",
              },
              directoryContents: null,
            },
          },
        },
      },
    },
  }

  it("Valid path where each directory exists", () => {
    cy.wrap(__isValidPath(["root", "folder1", "folder2"], tree)).should(
      "equal",
      true
    )
  })

  it("Invalid path where a directory does not exist", () => {
    cy.wrap(
      __isValidPath(["root", "folder1", "nonExistentFolder"], tree)
    ).should("equal", false)
  })

  it("Valid path where the last directory is reached", () => {
    cy.wrap(__isValidPath(["root", "folder1", "folder2"], tree)).should(
      "equal",
      true
    )
  })
})



// describe('mkdir', () => {
//     let tree: Tree = mkroot()

//     it('should add a new directory to an existing tree', () => {
//         // cy.wrap(tree).should('exist')
//         console.log('tree', tree)
//         mkdir(tree, 'newDir');
//         cy.wrap(tree['root']?.directoryContents).should('include', 'newDir')
//         // expect(tree['root']?.directoryContents['newDir'].entity.dirName).toBe('newDir');
//     });

//     // it('should add a new directory to a selected directory', () => {
//     //     mkdir(tree, 'selectedDir');
//     //     mkdir(tree, 'newDir');
//     //     // expect(tree['root']?.directoryContents['selectedDir'].directoryContents).toHaveProperty('newDir');
//     // });

//     // it('should handle the case when no directory is selected', () => {
//     //     // const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
//     //     mkdir(tree, 'newDir');
//     //     // expect(consoleSpy).toHaveBeenCalledWith('updated tree:', tree);
//     //     // expect(consoleSpy).toHaveBeenCalledWith('updated tree[qwe]:', undefined);
//     //     // consoleSpy.mockRestore();
//     // });
// });