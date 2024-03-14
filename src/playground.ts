import { cd, mkdir, mkfile, mkroot } from "./index.ts"
const root = mkroot()

cd(root, "root/")

mkdir(root, "qwe")
mkfile("The story of great adventures", root)

cd(root, "root/qwe")
mkdir(root, "asd")