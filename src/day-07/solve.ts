import _ from 'lodash';
import { readInput } from '../utils/aoc.js';
import math from '../utils/mathUtils.js'
import { patternMatch } from '../utils/stringutils.js';

enum Command {
  Back = 'back',
  ChangeDir = 'changedir',
  ListDir = 'listdir',
}

type File = {
  name: string,
  size: number,
}
type Folder = {
  name: string,
  files: Array<File>
  folders: Array<Folder>
  parent: Folder | null
}

function getCommand(line:string) {
  if (line === '$ cd ..') {
    return Command.Back
  }
  if (line.startsWith('$ cd ')) {
    return Command.ChangeDir
  }
  if (line.startsWith('dir ')) {
    return Command.ListDir
  }
  return null
}

function getFolderSize(folder: Folder) : number {
  return _.sum(folder.files.map(f => f.size)) + _.sum(folder.folders.map(f => getFolderSize(f)))
}

function getFolders(folder: Folder) : Array<Folder> {
  return [...folder.folders, ..._.flatten(folder.folders.map(f => getFolders(f)))]
}

export default function solve() {
  const content = readInput('input.txt')

  const terminal = content.split('\n').filter(line => line !== '$ ls').slice(1);

  const root:Folder = {
    name: '/',
    files: [],
    folders: [],
    parent: null,
  }
  let currentNode = root;

  terminal.forEach(line => {
    const command = getCommand(line)
    // Process files
    if (command === null) {
      const [fileSize, fileName] = patternMatch(line, '$int $str')
      if (fileName !== null) {
        currentNode.files.push({
          name: fileName,
          size: fileSize,
        })
      }
    // Process folder
    } else if (command === Command.ListDir) {
      const [folderName] = patternMatch(line, 'dir $str')
      currentNode.folders.push({
        name: folderName,
        files: [],
        folders: [],
        parent: currentNode,
      })
    // Process changing to directory
    } else if (command === Command.ChangeDir) {
      const [cdDir] = patternMatch(line, '\\$ cd $str');
      const matchingDirectory = currentNode.folders.find(f => f.name === cdDir)
      if (matchingDirectory) {
        currentNode = matchingDirectory
      }
    // Process going on lvl back
    } else if (command === Command.Back && currentNode.parent !== null) {
      currentNode = currentNode.parent
    }
  })

  const limitPart1 = 100000
  const part1 = getFolders(root).map(getFolderSize).filter(size => size <= limitPart1)
  console.log('Result part I', _.sum(part1))

  const limitPart2 = 30000000 - (70000000 - getFolderSize(root))
  const result = getFolders(root).map(getFolderSize).filter(size => size > limitPart2)
  console.log('Result part II', _.min(result))
}
