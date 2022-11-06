console.log('Polytech SEO')
const puppeteer = require('puppeteer')
const inquirer = require('inquirer')
const fs = require('fs')
const motsCles = require('./data/mots.json')
const output = require('./data/output.json')
let page; let browser

(async () => {
  inquirer.prompt([
    {
      type: 'list',
      name: 'prog',
      message: 'Select a programe',
      choices: ['Launch SEO', 'Generate data_set', 'Reset file']
    }
  ])
    .then((answers) => {
      switch (answers.prog) {
        case 'Launch SEO': {
          initSEO()
          break
        }
        case 'Generate data_set': {
          convertData()
          break
        }
        case 'Reset file': {
          // reset output.json and mots.json and output.csv
          inquirer.prompt([
            {
              type: 'list',
              name: 'prog',
              message: 'Select a file',
              choices: ['mots.json', 'output.json', 'data_set']
            }
          ])
            .then((answers) => {
              switch (answers.prog) {
                case 'mots.json': {
                  fs.writeFile('./data/mots.json', '[]', (err) => {
                    if (err) throw err
                    console.log('mots.json has been reset')
                  })
                  break
                }
                case 'output.json': {
                  fs.writeFile('./data/output.json', '[]', (err) => {
                    if (err) throw err
                    console.log('output.json has been reset')
                  })
                  break
                }
                case 'data_set': {
                  // acteurs ici les noms de domaines
                  fs.writeFile('./data_set/node.csv', 'ID;LABEL;MODULARITY', (err) => {
                    if (err) throw err
                    console.log('node.csv has been reset')
                  })
                  fs.writeFile('./data_set/edge.csv', 'SOURCE;TARGET;TYPE;ID;LABEL', (err) => {
                    if (err) throw err
                    console.log('edge.csv has been reset')
                  })
                  fs.writeFile('./data_set/edge2.csv', 'SOURCE;TARGET;TYPE;ID;LABEL', (err) => {
                    if (err) throw err
                    console.log('edge2.csv has been reset')
                  })
                  break
                }
                default: {
                  console.log('Error')
                }
              }
            })
          break
        }

        default: {
          process.exit()
        }
      }
    })
})()

async function initSEO () {
  console.log('Launching SEO')
  console.log(`Number of keyword : ${motsCles.length}`)
  console.log(`Estimated time : ${motsCles.length * 5} seconds`)

  browser = await puppeteer.launch({
    headless: false
  })
  page = await browser.newPage()

  for (const mot of motsCles) {
    await traitement(mot)
  }
}

async function traitement (mot) {
  await wait(5000) // attente de 5 secondes entre les requêtes
  console.log(mot)
  await page.goto(`https://www.google.fr/search?q=${mot}`, { waitUntil: 'networkidle2' })
  const searchResults = await page.$$eval('.LC20lb', (els) =>
    els.map((e) => ({ title: e.innerText, link: e.parentNode.href }))
  )
  searchResults.forEach((research) => {
    const domain = getDomain(research.link)
    if (!output[domain]) {
      output[domain] = []
    }
    output[domain].push(
      {
        motsCles: mot,
        liens: research.link
      })
    writeJsonFileUTF8('./data/output.json', output)
  })
  console.log(searchResults)
}

function getDomain (url) {
  const arr = url.split('/')
  return arr[0] + '//' + arr[2]
}

async function wait (ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}

function writeJsonFileUTF8 (path, variable) {
  fs.writeFile(path,
    JSON.stringify(variable, null, 1), 'utf8',
    (err) => {
      if (err) {
        console.log(err)
      }
    }
  )
}

function convertData () {
  console.log('Generating data_set')
  const nodes = {
    url: [],
    liens: [],
    motsCles: []
  }
  for (const url in output) {
    output[url].forEach((research) => {
      if (!nodes.url.includes(url)) {
        fs.appendFileSync('./data_set/node.csv', `\n${url};${url};1`) // acteurs
        nodes.url.push(url)
      }
      if (!nodes.motsCles.includes(research.motsCles)) {
        fs.appendFileSync('./data_set/node.csv', `\n${research.motsCles};${research.motsCles};2`)
        nodes.motsCles.push(research.motsCles)
      }

      // pas nécessaire pour des données plus claires
      // if (!nodes.liens.includes(research.liens)) {
      //   fs.appendFileSync('./data_set/node.csv', `\n${research.liens};${research.liens}`)
      //   nodes.liens.push(research.liens)
      // }
      // fs.appendFileSync('./data_set/edge2.csv', `\n${url};${research.liens};;;${research.motsCles}`) // mot clé vers nom de domaine

      fs.appendFileSync('./data_set/edge.csv', `\n${research.motsCles};${url};;;${research.motsCles}`) // nom de domaine vers lien
    })
  }
  console.log('data_set created')
}
