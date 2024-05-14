#!/usr/bin/env node
import { rehypeAstro, remarkAstro } from '@nasa-gcn/remark-rehype-astro'
import { program } from 'commander'
import { readFileSync, writeFileSync } from 'node:fs'
import rehypeFormat from 'rehype-format'
import rehypeStringify from 'rehype-stringify'
import remarkGfm from 'remark-gfm'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { type Processor, unified } from 'unified'
import { removePosition } from 'unist-util-remove-position'

/* Transformer plugin to remove position data from nodes. */
function remarkRemovePosition() {
  return removePosition
}

/* Markdown compiler plugin to emit the syntax tree as a JSON document. */
function remarkStringifyJson(this: Processor) {
  this.Compiler = function (value) {
    return `${JSON.stringify(value, null, 2)}\n`
  }
}

function getStdinStream() {
  process.stdin.resume()
  return process.stdin.fd
}

program
  .description(
    'Render Astro Flavored Markdown as a JSON syntax tree or as HTML'
  )
  .argument('[input]', 'input file [default: stdin]')
  .option('--html', 'output is in HTML [default: output is in JSON]')
  .option('-o, --output <output>', 'output file [default: stdout]')
  .parse()

const opts = program.opts()
const args = program.args

const processor = unified()
  .use(remarkParse)
  .use(remarkRemovePosition)
  .use(remarkGfm)

if (opts.html) {
  processor
    .use(remarkRehype)
    .use(rehypeAstro)
    .use(rehypeFormat)
    .use(rehypeStringify)
} else {
  processor.use(remarkAstro).use(remarkStringifyJson)
}

const input = readFileSync(args[0] || getStdinStream(), {
  encoding: 'utf-8',
}).trim()
const { value } = processor.processSync(input)
writeFileSync(opts.output || process.stdout.fd, value)
