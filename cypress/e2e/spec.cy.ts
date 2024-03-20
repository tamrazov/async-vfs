import { Tree } from "src/types"
import { mkroot, cd } from "@src"
import { __isValidPath, __getSelectedDir } from "src/helpers"
import { mkdir, mkfile } from "@src"

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

describe("mkdir", () => {
  const tree: Tree = mkroot()

  it("should add a new directory to the root directory", () => {
    mkdir(tree, "newDir")
    cy.wrap(tree["root"]?.directoryContents).should("have.property", "newDir")
    cy.wrap(tree["root"]?.directoryContents?.newDir?.entity).should(
      "have.property",
      "dirName",
      "newDir"
    )
  })

  it("should add a new directory to a selected directory", () => {
    cy.on("fail", (err) => {
      expect(err.message).to.include("Selected node not found")
      return false
    })
    cd(tree, "root")
    mkdir(tree, "selectedDir")
    cy.wrap(tree["root"]?.directoryContents).should(
      "have.property",
      "selectedDir"
    )
    cd(tree, "root/selectedDir")
    mkdir(tree, "newDir")
    cy.wrap(
      tree["root"]?.directoryContents?.selectedDir?.directoryContents
    ).should("have.property", "newDir")
  })

  it("should not add a new directory when no directory is selected", () => {
    cy.on("fail", (err) => {
      expect(err.message).to.equal("No directory is selected")
      return false
    })
    mkdir(tree, "newDir")
  })
})

describe("mkfile", () => {
  const tree: Tree = mkroot()

  it("should add a new file to the root directory", () => {
    cy.on("fail", (err) => {
      expect(err.message).to.equal("No directory is selected")
      return false
    })
    mkfile("newFile.txt", tree)
    cy.wrap(tree["root"]?.directoryContents).should(
      "have.property",
      "newFile.txt"
    )
  })

  it("should add a new file to a selected directory", () => {
    cd(tree, "root")
    mkdir(tree, "selectedDir")
    cd(tree, "root/selectedDir")
    cy.on("fail", (err) => {
      expect(err.message).to.equal("No directory is selected")
      return false
    })
    mkfile("newFile.txt", tree)
    cy.wrap(
      tree["root"]?.directoryContents?.selectedDir?.directoryContents
    ).should("have.property", "newFile.txt")
  })

  it("should not add a new file when no directory is selected", () => {
    cy.on("fail", (err) => {
      expect(err.message).to.equal("No directory is selected")
      return false
    })
    mkfile("newFile.txt", tree)
  })
})

describe("cd", () => {
  const tree: Tree = mkroot()

  it("should change to the root directory", () => {
    cd(tree, "root")
    const selectedNode = __getSelectedDir(tree)
    cy.wrap(selectedNode?.entity).should("have.property", "dirName", "root")
    cy.wrap(selectedNode?.entity).should("have.property", "isInside", true)
  })

  it("should change to a subdirectory", () => {
    mkdir(tree, "subDir")
    cd(tree, "root/subDir")
    const selectedNode = __getSelectedDir(tree)
    cy.wrap(selectedNode?.entity).should("have.property", "dirName", "subDir")
    cy.wrap(selectedNode?.entity).should("have.property", "isInside", true)
  })

  it("should not change directory for an invalid path", () => {
    cy.on("fail", (err) => {
      expect(err.message).to.equal("Invalid file path")
      return false
    })
    cd(tree, "root/invalidDir")
  })
})
