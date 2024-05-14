[![NPM Version](https://img.shields.io/npm/v/%40nasa-gcn%2Fafm)](https://www.npmjs.com/package/@nasa-gcn/afm)

# Astro Flavored Markdown

This is a command-line tool to render Astro Flavored Markdown documents to JSON abstract syntax trees or HTML. Astro Flavored Markdown is a dialect of [Markdown](https://www.markdownguide.org) for rapid astronomy communications. Astro Flavored Markdown detects and enriches dates, times, sky coordinates, and bibliographic references in text.

This command-line interface is a thin wrapper around [remark-rehype-astro](https://www.npmjs.com/package/@nasa-gcn/remark-rehype-astro), the reference implementation of Astro Flavored Markdown as a plugin for the [Unified](https://unifiedjs.com) parser ecosystem.

## Usage

```
Usage: afm [options] [input]

Render Astro Flavored Markdown as a JSON syntax tree or as HTML

Arguments:
  input                  input file [default: stdin]

Options:
  --html                 output is in HTML [default: output is in JSON]
  -o, --output <output>  output file [default: stdout]
  -h, --help             display help for command
```

## Example

Place the following text into a file called example.md:

```
# Example

Here is a table:

| Transient | Classification |
| --------- | -------------- |
| AT2017gfo | kilonova       |
```

To render as a JSON syntax tree:

```
$ npx afm example.md
{
  "type": "root",
  "children": [
    {
      "type": "heading",
      "depth": 1,
      "children": [
        {
          "type": "text",
          "value": "Example"
        }
      ]
    },
    {
      "type": "paragraph",
      "children": [
        {
          "type": "text",
          "value": "Here is a table:"
        }
      ]
    },
    {
      "type": "table",
      "align": [
        null,
        null
      ],
      "children": [
        {
          "type": "tableRow",
          "children": [
            {
              "type": "tableCell",
              "children": [
                {
                  "type": "text",
                  "value": "Transient"
                }
              ]
            },
            {
              "type": "tableCell",
              "children": [
                {
                  "type": "text",
                  "value": "Classification"
                }
              ]
            }
          ]
        },
        {
          "type": "tableRow",
          "children": [
            {
              "type": "tableCell",
              "children": [
                {
                  "type": "text",
                  "value": "AT2017gfo",
                  "data": {
                    "class": "tns",
                    "value": "2017gfo"
                  }
                }
              ]
            },
            {
              "type": "tableCell",
              "children": [
                {
                  "type": "text",
                  "value": "kilonova"
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

To render as HTML:

```
$ npx afm --html example.md

<h1>Example</h1>
<p>Here is a table:</p>
<table>
  <thead>
    <tr>
      <th>Transient</th>
      <th>Classification</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><data class="tns" value="2017gfo">AT2017gfo</data></td>
      <td>kilonova</td>
    </tr>
  </tbody>
</table>
```
